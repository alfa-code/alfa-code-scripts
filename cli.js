#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

// const { exec, spawn } = require('child_process');

const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');

// console.log('process.env', process.env);

const buildModeTypes = {
    development: 'development',
    production: 'production'
}

const buildSideTipes = {
    client: 'client',
    server: 'server',
    library: 'library',
}

function build(config) {
    let compiler = webpack(config);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }
            const rawMessages = stats.toJson({}, true);
            const messages = formatWebpackMessages({
                errors: rawMessages.errors.map((e) => e.message),
                warnings: rawMessages.warnings.map((e) => e.message),
            });
            if (messages.errors.length) {
                // Only keep the first error. Others are often indicative
                // of the same problem, but confuse the reader with noise.
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }
                return reject(new Error(messages.errors.join('\n\n')));
            }
            // if (
            //     process.env.CI && (
            //         process.env.CI.toLowerCase() !== 'false'
            //     ) &&
            //     messages.warnings.length
            // ) {
            //     console.log(
            //         chalk.yellow(
            //             '\nTreating warnings as errors because process.env.CI = true.\n' +
            //             'Most CI servers set it automatically.\n'
            //         )
            //     );
            //     return reject(new Error(messages.warnings.join('\n\n')));
            // }
            return resolve({
                stats,
                warnings: messages.warnings,
            });
        });
    });
}

// function spawnCommand(command) {
//     const ls = spawn('ls', ['-lh', '/usr']);

//     ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//     });

//     ls.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//     });

//     ls.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//     });
// }

function calculateBuildMode(argv) {
    const mode = argv.mode || argv.m;

    switch (mode) {
        case buildModeTypes.production:
        case buildModeTypes.development: {
            console.log(`Build started in ${mode} mode.`);
            return mode;
        }
        default: {
            console.log('You should set mode in available value. See --help for explain.');
            console.log(new Error('Incorrect build mode parameter.'));
            break;
        }
    }
}

function calculateTypeMode(argv) {
    const type = argv.type || argv.t;

    const isTypeCorrect = Object.values(buildSideTipes).some((buildSideType) => {
        return type === buildSideType;
    });
    
    if (!isTypeCorrect) {
        console.log('You should set type in available value. See --help for explain.');
        console.log(new Error('Incorrect type parameter.'));
    }

    console.log(`Build started for ${type} side.`);

    return type;
}

async function startBuild(mode, type) {
    console.log('mode', mode)
    switch (mode) {
        case buildModeTypes.development: {
            process.env.NODE_ENV = 'development';
            {
                switch (type) {
                    case buildSideTipes.client: {
                        console.log(chalk.blue('client build is started'));

                        const webpackClientBuildConfig = require('./scripts/build/webpack/config/client/webpack.config')();

                        build(webpackClientBuildConfig)
                            .then(({ stats, warnings }) => {
                                if (warnings.length) {
                                    console.log(chalk.yellow('Client compiled with warnings.\n'));
                                    console.log(warnings.join('\n\n'));
                                    console.log(
                                        `Search for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`
                                    );
                                    console.log(
                                        `To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.`
                                    );
                                } else {
                                    console.log(chalk.green('Client compiled successfully.\n'));
                                }
                        
                                function printOutputSizes(webpackConfig) {
                                    const sizes = calculateAssetsSizes(stats, webpackConfig?.output?.path);
                                    printAssetsSizes(sizes);
                                }
                        
                                if (Array.isArray(config)) {
                                    config.forEach(printOutputSizes)
                                } else {
                                    printOutputSizes(config);
                                }
                            })
                            .catch((err) => {
                                console.log(chalk.red('Failed to compile client.\n'));
                                console.log('err', err)
                                printBuildError(err);
                                process.exit(1);
                            });
                        break;
                    }
                    case buildSideTipes.server: {
                        // exec('NODE_ENV=development webpack --config ./scripts/build/webpack/config/server/webpack.config.js');
                        break;
                    }
                    default : {
                        break;
                    }
                }
            }
            break;
        }
        default:
            break;
    }
}

yargs(hideBin(process.argv))
    .command('build', 'Start project build', {
        mode: {
            alias: 'm',
            default: 'production'
        },
        type: {
            alias: 't',
            default: 'client'
        }
    }, (argv) => {
        console.log('Start project build...');

        console.log('argv 111', argv)

        const mode = calculateBuildMode(argv);
        const type = calculateTypeMode(argv);
        startBuild(mode, type);
    })
    .option('mode', {
        alias: 'm',
        type: 'string',
        description: 'Set build mode ("production" by default)'
    })
    .option('type', {
        alias: 't',
        type: 'string',
        description: 'Set type of builf ("client" by default) ("client | server | library")'
    })
    .argv;
