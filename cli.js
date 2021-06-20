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

function buildStatusReport({ stats, warnings, type }) {
    if (warnings.length) {
        console.log(chalk.yellow(`${type} compiled with warnings.\n`));
        console.log(warnings.join('\n\n'));
        console.log(
            `Search for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`
        );
        console.log(
            `To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.`
        );
    } else {
        console.log(chalk.green(`${chalk.bold(type)} compiled successfully.\n`));
    }
}

function build(config, isWatch, type) {
    function copileDetector(err, stats) {
        if (err) {
            console.log(chalk.red(`Failed to compile ${type}.\n`));
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
            console.log(chalk.red(`Failed to compile ${type}.\n`));
            console.log('err', err)
            printBuildError(err);
            return;
        }

        buildStatusReport({
            stats,
            warnings: messages.warnings,
            type
        });
    }

    let compiler = webpack(config);

    // Compiler Hook
    compiler.hooks.thisCompilation.tap('thisCompilation', (params, callback) => {
        console.log(chalk.blue(`${chalk.bold(type)} compilation in progress...`));
    });

    if (isWatch) {
        compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, copileDetector);
    } else {
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

    if (typeof type !== 'string') {
        console.log('You should set type in available value. See --help for explain.');
        console.log(new Error('Incorrect type parameter.'));
    }

    const types = type.split(',');

    const isTypesCorrect = types.every((type) => {
        return !!buildSideTipes[type];
    });
    
    if (!isTypesCorrect) {
        console.log('You should set type in available value. See --help for explain.');
        console.log(new Error('Incorrect type parameter.'));
    }

    console.log(`Build started for ${type} side. \n`);

    return types;
}

async function startBuild(mode, types, isWatch) {
    process.env.NODE_ENV = mode;

    types.forEach(async (type) => {
        console.log(`${chalk.blue.bold(type)} build is started. \n`);
        const webpackClientBuildConfig = require(`./scripts/build/webpack/config/${type}/webpack.config`)();
        build(webpackClientBuildConfig, isWatch, type);
    });
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
        const types = calculateTypeMode(argv);
        const watch = typeof argv.watch === 'boolean' ? argv.watch : false;
        startBuild(mode, types, watch);
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
