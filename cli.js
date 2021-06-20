#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');

const buildModeTypes = {
    development: 'development',
    production: 'production'
}

const buildSideTipes = {
    client: 'client',
    server: 'server',
    library: 'library',
}

function buildStatusReport({ stats, warnings }) {
    if (warnings.length) {
        console.log(chalk.yellow(`Compiled ompiled with warnings.\n`));
        console.log(warnings.join('\n\n'));
        console.log(
            `Search for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`
        );
        console.log(
            `To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.`
        );
    } else {
        console.log(chalk.green(`Compiled successfully.\n`));
    }
}

function build(config, isWatch) {
    function copileDetector(err, stats) {
        if (err) {
            console.log(chalk.red('Failed to compile client.\n'));
            console.log('err', err)
            chalk.red(printBuildError(err));
            return;
            // process.exit(1);
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

            const err = new Error(messages.errors.join('\n\n'));
            console.log(chalk.red('Failed to compile client.\n'));
            console.log('err', err)
            printBuildError(err);
            return;
        }

        buildStatusReport({
            stats,
            warnings: messages.warnings,
        });
    }

    let compiler = webpack(config);

    compiler.hooks.thisCompilation.tap('thisCompilation', (params, callback) => {
        console.log(chalk.blue('Compilation in progress...'));
    });

    if (isWatch) {
        compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, copileDetector);
    } else {
        console.log('compiler.run')
        compiler.run(copileDetector);
    }
}

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

    console.log(`Build started for ${type} side. \n`);

    return type;
}

async function startBuild(mode, type, isWatch) {
    process.env.NODE_ENV = mode;

    switch (type) {
        case buildSideTipes.client: {
            console.log(chalk.blue('Client'), 'build is started. \n');
            const webpackClientBuildConfig = require('./scripts/build/webpack/config/client/webpack.config')();
            build(webpackClientBuildConfig, isWatch);
            break;
        }
        case buildSideTipes.server: {
            console.log(chalk.blue('Server build is started.'));
            const webpackServerBuildConfig = require('./scripts/build/webpack/config/server/webpack.config')();
            build(webpackServerBuildConfig, isWatch);
            break;
        }
        default : {
            break;
        }
    }
}

yargs(hideBin(process.argv))
    .command('build', 'Start project build \n', {
        mode: {
            alias: 'm',
            default: 'production'
        },
        type: {
            alias: 't',
            default: 'client'
        },
        watch: {
            alias: 'w',
            default: false
        }
    }, (argv) => {
        console.log(chalk.blue('Start project build...'));

        const mode = calculateBuildMode(argv);
        const type = calculateTypeMode(argv);
        const watch = typeof argv.watch === 'boolean' ? argv.watch : false;
        startBuild(mode, type, watch);
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
    .option('watch', {
        alias: 'w',
        type: 'boolean',
        description: 'Build within watch mode ("false" by default)'
    })
    .argv;
