// Copyright (C) 2018, Zpalmtree
// Copyright (C) 2019, WrkzCoin
// Copyright (C) 2019-2020, NinjaCoin
// Please see the included LICENSE file for more information.

import { MixinLimit, MixinLimits, Daemon } from 'ninjacoin-wallet-backend';
import { name, version } from '../package.json';

const Configure = new function() {
    /**
     * If you can't figure this one out, I don't have high hopes
     */
    this.coinName = 'NinjaCoin';

    /**
     * Prefix for URI encoded addresses
     */
    this.uriPrefix = 'ninjacoin://';

    /**
     * How often to save the wallet, in milliseconds
     */
    this.walletSaveFrequency = 60 * 1000;

    /**
     * The amount of decimal places your coin has, e.g. TurtleCoin has two
     * decimals
     */
    this.decimalPlaces = 5;

    /**
     * The address prefix your coin uses - you can find this in CryptoNoteConfig.h.
     * In TurtleCoin, this converts to Ninja
     */
    this.addressPrefix = 10115542401;

    /**
     * Request timeout for daemon operations in milliseconds
     */
    this.requestTimeout = 30 * 1000;

    /**
     * The block time of your coin, in seconds
     */
    this.blockTargetTime = 60;

    /**
     * How often to process blocks, in millseconds
     */
    this.syncThreadInterval = 10;

    /**
     * How often to update the daemon info, in milliseconds
     */
    this.daemonUpdateInterval = 15 * 1000;

    /**
     * How often to check on locked transactions
     */
    this.lockedTransactionsCheckInterval = 30 * 1000;

    /**
     * The amount of blocks to process per 'tick' of the mainloop. Note: too
     * high a value will cause the event loop to be blocked, and your interaction
     * to be laggy.
     */
    this.blocksPerTick = 100;

    /**
     * Your coins 'ticker', generally used to refer to the coin, i.e. 123 TRTL
     */
    this.ticker = 'NINJA';

    /**
     * Most people haven't mined any blocks, so lets not waste time scanning
     * them
     */
    this.scanCoinbaseTransactions = false;

    /**
     * Disable AutoOptimization by default
     */
    this.enableAutoOptimization = true;

    /**
     * The minimum fee allowed for transactions, in ATOMIC units
     */
    this.minimumFee = 500;

    /**
     * Fee per byte height
     */
    this.feePerByteHeight = 950000;

    /**
     * Mapping of height to mixin maximum and mixin minimum
     */
    this.mixinLimits = new MixinLimits([
        /* Height: 440,000, minMixin: 0, maxMixin: 3, defaultMixin: 3 */
        new MixinLimit(440000, 0, 3, 3),

        /* At height of 471,000 */
        new MixinLimit(471000, 0, 3, 3),

        /* At height of 472,000 */
        new MixinLimit(472000, 0, 3, 3),

    ], 3 /* Default mixin of 3 before block 440,000 */);

    /**
     * The length of a standard address for your coin
     */
    this.standardAddressLength = 101;

    /**
     * The length of an integrated address for your coin - It's the same as
     * a normal address, but there is a paymentID included in there - since
     * payment ID's are 64 chars, and base58 encoding is done by encoding
     * chunks of 8 chars at once into blocks of 11 chars, we can calculate
     * this automatically
     */
    this.integratedAddressLength = 101 + ((64 * 11) / 8);

    /**
     * Memory to use for storing downloaded blocks - 32MB
     */
    this.blockStoreMemoryLimit = 1024 * 1024 * 32;

    /**
     * Amount of blocks to request from the daemon at once
     */
    this.blocksPerDaemonRequest = 50;

    /**
     * User agent string
     */
    this.customUserAgentString = `${name}-v${version}`;

    this.customRequestOptions = { pool: { maxSockets: 100 }, agent: false },

    /**
     * Unix timestamp of the time your chain was launched.
     *
     * Note - you may want to manually adjust this. Take the current timestamp,
     * take away the launch timestamp, divide by block time, and that value
     * should be equal to your current block count. If it's significantly different,
     * you can offset your timestamp to fix the discrepancy
     */
    this.chainLaunchTimestamp = new Date(1000 * 1554129297);

    /**
     * Fee to take on all transactions, in percentage
     */
    this.devFeePercentage = 0.5;

    /**
     * Address to send dev fee to
     */
    this.devFeeAddress = 'Ninja12DbN1QHr3p7uuNEDGfXS1C5RU5hZCqmreNUWurGTYpswD86QfioFxT1mkcYRJbVwJVYkf7tGqj3QjizeHRUT7uiuWHfbG3C';

    /**
     * Base url for price API
     *
     * The program *should* fail gracefully if your coin is not supported, or
     * you just set this to an empty string. If you have another API you want
     * it to support, you're going to have to modify the code in Currency.js.
     */
    this.priceApiLink = 'https://api.coingecko.com/api/v3/simple/price';

    /**
     * Default daemon to use. Can either be a BlockchainCacheApi(baseURL, SSL),
     * or a ConventionalDaemon(url, port).
     */
    this.defaultDaemon = new Daemon('public.ninjanode.net', 11801);

    /**
     * A url to fetch node info from. Should follow the turtlepay format 
     * detailed here: https://docs.turtlepay.io/blockapi/
     */

    this.DefaultDaemonRPCPort = '11801';

    this.nodeListURL = 'https://api-ninjapay.ninjanode.net/node/list';

    this.ExplorerURL = 'https://explorer.ninjacoin.org';

    this.GitHubRepo = 'https://github.com/ninjacoin-master/ninja-wallet-pro';

    this.DiscordURL = 'https://discord.ninjacoin.org';
};

export default Configure;
