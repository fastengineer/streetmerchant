import {existsSync, readFileSync} from 'fs';
import {banner} from './banner';
import dotenv from 'dotenv';
import path from 'path';
import * as console from 'console';

if (process.env.npm_config_conf) {
  if (
    existsSync(path.resolve(__dirname, '../../' + process.env.npm_config_conf))
  ) {
    dotenv.config({
      path: path.resolve(__dirname, '../../' + process.env.npm_config_conf),
    });
  } else {
    dotenv.config({path: path.resolve(__dirname, '../../.env')});
  }
} else if (existsSync(path.resolve(__dirname, '../../dotenv'))) {
  dotenv.config({path: path.resolve(__dirname, '../../dotenv')});
} else {
  dotenv.config({path: path.resolve(__dirname, '../../.env')});
}

console.info(
  banner.render(
    envOrBoolean(process.env.ASCII_BANNER, false),
    envOrString(process.env.BANNER_COLOR, '#808080')
  )
);

/**
 * Returns environment variable, given array, or default array.
 *
 * @param environment Interested environment variable.
 * @param array Default array. If not set, is `[]`.
 */
function envOrArray(
  environment: string | undefined,
  array?: string[]
): string[] {
  return (environment
    ? environment.includes('\n')
      ? environment.split('\n')
      : environment.split(',')
    : array ?? []
  ).map(s => s.trim());
}

/**
 * Returns environment variable, given boolean, or default boolean.
 *
 * @param environment Interested environment variable.
 * @param boolean Default boolean. If not set, is `true`.
 */
function envOrBoolean(
  environment: string | undefined,
  boolean?: boolean
): boolean {
  return environment ? environment === 'true' : boolean ?? true;
}

/**
 * Returns environment variable, given string, or default string.
 *
 * @param environment Interested environment variable.
 * @param string Default string. If not set, is `''`.
 */
function envOrString(environment: string | undefined, string?: string): string {
  return environment ? environment : string ?? '';
}

/**
 * Returns environment variable, given number, or default number.
 *
 * @param environment Interested environment variable.
 * @param number Default number. If not set, is `0`.
 */
function envOrNumber(environment: string | undefined, number?: number): number {
  return environment ? Number(environment) : number ?? 0;
}

/**
 * Returns environment variable, given number, or default number,
 * while handling dotenv input errors for a Min/Max pair.
 * dotenv errors handled:
 * - Min/Max swapped (Min larger than Max, Max smaller than Min)
 * - Min larger than default Max when no Max defined
 * - Max smaller than default Min when no Min defined
 *
 * @param environmentMin Min environment variable of Min/Max pair.
 * @param environmentMax Max environment variable of Min/Max pair.
 * @param number Default number. If not set, is `0`.
 */
function envOrNumberMin(
  environmentMin: string | undefined,
  environmentMax: string | undefined,
  number?: number
) {
  if (environmentMin || environmentMax) {
    if (environmentMin && environmentMax) {
      return Number(
        Number(environmentMin) < Number(environmentMax)
          ? environmentMin
          : environmentMax
      );
    }

    if (environmentMax) {
      return Number(environmentMax) < (number ?? 0)
        ? Number(environmentMax)
        : number ?? 0;
    }

    if (environmentMin) {
      return Number(environmentMin);
    }
  }

  return number ?? 0;
}

/**
 * Returns environment variable, given number, or default number,
 * while handling dotenv input errors for a Min/Max pair.
 * dotenv errors handled:
 * - Min/Max swapped (Min larger than Max, Max smaller than Min)
 * - Min larger than default Max when no Max defined
 * - Max smaller than default Min when no Min defined
 *
 * @param environmentMin Min environment variable of Min/Max pair.
 * @param environmentMax Max environment variable of Min/Max pair.
 * @param number Default number. If not set, is `0`.
 */
function envOrNumberMax(
  environmentMin: string | undefined,
  environmentMax: string | undefined,
  number?: number
) {
  if (environmentMin || environmentMax) {
    if (environmentMin && environmentMax) {
      return Number(
        Number(environmentMin) < Number(environmentMax)
          ? environmentMax
          : environmentMax
      );
    }

    if (environmentMin) {
      return Number(environmentMin) > (number ?? 0)
        ? Number(environmentMin)
        : number ?? 0;
    }

    if (environmentMax) {
      return Number(environmentMax);
    }
  }

  return number ?? 0;
}

function loadProxyList(filename: string): string[] | undefined {
  try {
    return readFileSync(`${filename}.proxies`)
      .toString()
      .trim()
      .split('\n')
      .map(x => x.trim());
  } catch {
    return undefined;
  }
}

const browser = {
  isHeadless: envOrBoolean(process.env.HEADLESS),
  isIncognito: envOrBoolean(process.env.INCOGNITO, false),
  isTrusted: envOrBoolean(process.env.BROWSER_TRUSTED, false),
  lowBandwidth: envOrBoolean(process.env.LOW_BANDWIDTH, false),
  maxBackoff: envOrNumberMax(
    process.env.PAGE_BACKOFF_MIN,
    process.env.PAGE_BACKOFF_MAX,
    3600000
  ),
  maxSleep: envOrNumberMax(
    process.env.PAGE_SLEEP_MIN,
    process.env.PAGE_SLEEP_MAX,
    10000
  ),
  minBackoff: envOrNumberMin(
    process.env.PAGE_BACKOFF_MIN,
    process.env.PAGE_BACKOFF_MAX,
    10000
  ),
  minSleep: envOrNumberMin(
    process.env.PAGE_SLEEP_MIN,
    process.env.PAGE_SLEEP_MAX,
    5000
  ),
  open: envOrBoolean(process.env.OPEN_BROWSER),
  userAgent: '',
};

const docker = envOrBoolean(process.env.DOCKER, false);

const logLevel = envOrString(process.env.LOG_LEVEL, 'info');

const notifications = {
  desktop: process.env.DESKTOP_NOTIFICATIONS === 'true',
  discord: {
    notifyGroup: envOrArray(process.env.DISCORD_NOTIFY_GROUP),
    notifyGroupSeries: {
      '3060ti': envOrArray(process.env.DISCORD_NOTIFY_GROUP_3060TI),
      3070: envOrArray(process.env.DISCORD_NOTIFY_GROUP_3070),
      3080: envOrArray(process.env.DISCORD_NOTIFY_GROUP_3080),
      3090: envOrArray(process.env.DISCORD_NOTIFY_GROUP_3090),
      'captcha-deterrent': [],
      darkhero: envOrArray(process.env.DISCORD_NOTIFY_GROUP_DARKHERO),
      rx6800: envOrArray(process.env.DISCORD_NOTIFY_GROUP_RX6800),
      rx6800xt: envOrArray(process.env.DISCORD_NOTIFY_GROUP_RX6800XT),
      rx6900xt: envOrArray(process.env.DISCORD_NOTIFY_GROUP_RX6900XT),
      ryzen5600: envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN5600),
      ryzen5800: envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN5800),
      ryzen5900: envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN5900),
      ryzen5950: envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN5950),
      sf: envOrArray(process.env.DISCORD_NOTIFY_GROUP_CORSAIR_SF),
      sonyps5c: envOrArray(process.env.DISCORD_NOTIFY_GROUP_SONYPS5C),
      sonyps5de: envOrArray(process.env.DISCORD_NOTIFY_GROUP_SONYPS5DE),
      'test:series': envOrArray(process.env.DISCORD_NOTIFY_GROUP_TEST),
      xboxss: envOrArray(process.env.DISCORD_NOTIFY_GROUP_XBOXSS),
      xboxsx: envOrArray(process.env.DISCORD_NOTIFY_GROUP_XBOXSX),
       // ---------------------------- //
			'5700xt': envOrArray(process.env.DISCORD_NOTIFY_GROUP_5700XT),
			'3060TITRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_3060TITRY),
			'3070TRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_3070TRY),
			'3080TRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_3080TRY),
			'3090TRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_3090TRY),
			'RX6800TRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RX6800TRY),
			'RX6800XTTRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RX6800XTTRY),
			'RX6900XTTRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RX6900XTTRY),
			'RYZEN5600XTRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN5600XTRY),
			'RYZEN5800XTRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN5800XTRY),
			'RYZEN5900XTRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN5900XTRY),
			'RYZEN5950XTRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN5950XTRY),
			// ---------------------------- //
			'RYZEN3600': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN3600),
			'RYZEN3600X': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN3600X),
			'RYZEN3600XT': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN3600XT),
			'RYZEN3600TRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN3600TRY),
			'RYZEN3600XTRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN3600XTRY),
			'RYZEN3600XTTRY': envOrArray(process.env.DISCORD_NOTIFY_GROUP_RYZEN3600XTTRY),
    },
    webhooks: envOrArray(process.env.DISCORD_WEB_HOOK),
  },
  email: {
    password: envOrString(process.env.EMAIL_PASSWORD),
    smtpAddress: envOrString(process.env.SMTP_ADDRESS),
    smtpPort: envOrNumber(process.env.SMTP_PORT, 25),
    to: envOrString(
      process.env.EMAIL_TO,
      envOrString(process.env.EMAIL_USERNAME)
    ),
    username: envOrString(process.env.EMAIL_USERNAME),
  },
  mqtt: {
    broker: envOrString(process.env.MQTT_BROKER_ADDRESS),
    clientId: envOrString(process.env.MQTT_CLIENT_ID),
    password: envOrString(process.env.MQTT_PASSWORD),
    port: envOrNumber(process.env.MQTT_BROKER_PORT, 1883),
    qos: envOrNumber(process.env.MQTT_QOS, 0),
    topic: envOrString(process.env.MQTT_TOPIC, 'streetmerchant/alert'),
    username: envOrString(process.env.MQTT_USERNAME),
  },
  pagerduty: {
    integrationKey: envOrString(process.env.PAGERDUTY_INTEGRATION_KEY),
    severity: envOrString(process.env.PAGERDUTY_SEVERITY, 'info'),
  },
  philips_hue: {
    accessToken: envOrString(process.env.PHILIPS_HUE_CLOUD_ACCESS_TOKEN),
    apiKey: envOrString(process.env.PHILIPS_HUE_API_KEY),
    bridgeIp: envOrString(process.env.PHILIPS_HUE_LAN_BRIDGE_IP),
    clientId: envOrString(process.env.PHILIPS_HUE_CLOUD_CLIENT_ID),
    clientSecret: envOrString(process.env.PHILIPS_HUE_CLOUD_CLIENT_SECRET),
    lightColor: envOrString(process.env.PHILIPS_HUE_LIGHT_COLOR),
    lightIds: envOrString(process.env.PHILIPS_HUE_LIGHT_IDS),
    lightPattern: envOrString(process.env.PHILIPS_HUE_LIGHT_PATTERN),
    refreshToken: envOrString(process.env.PHILIPS_HUE_CLOUD_REFRESH_TOKEN),
    remoteApiUsername: envOrString(process.env.PHILIPS_HUE_API_KEY),
  },
  phone: {
    availableCarriers: new Map([
      ['att', 'txt.att.net'],
      ['attgo', 'mms.att.net'],
      ['bell', 'txt.bell.ca'],
      ['fido', 'fido.ca'],
      ['google', 'msg.fi.google.com'],
      ['koodo', 'msg.koodomobile.com'],
      ['mint', 'mailmymobile.net'],
      ['rogers', 'pcs.rogers.com'],
      ['sprint', 'messaging.sprintpcs.com'],
      ['telus', 'msg.telus.com'],
      ['tmobile', 'tmomail.net'],
      ['uscc', 'mms.uscc.net'],
      ['verizon', 'vtext.com'],
      ['virgin', 'vmobl.com'],
      ['virgin-ca', 'vmobile.ca'],
      ['visible', 'vtext.com'],
    ]),
    carrier: envOrArray(process.env.PHONE_CARRIER),
    number: envOrArray(process.env.PHONE_NUMBER),
  },
  playSound: envOrString(process.env.PLAY_SOUND),
  pushbullet: envOrString(process.env.PUSHBULLET),
  pushover: {
    expire: envOrNumber(process.env.PUSHOVER_EXPIRE),
    priority: envOrNumber(process.env.PUSHOVER_PRIORITY),
    retry: envOrNumber(process.env.PUSHOVER_RETRY),
    token: envOrString(process.env.PUSHOVER_TOKEN),
    username: envOrString(process.env.PUSHOVER_USER),
  },
  redis: {
    url: envOrString(process.env.REDIS_URL),
  },
  slack: {
    channel: envOrString(process.env.SLACK_CHANNEL),
    token: envOrString(process.env.SLACK_TOKEN),
  },
  soundPlayer: envOrString(process.env.SOUND_PLAYER),
  telegram: {
    accessToken: envOrString(process.env.TELEGRAM_ACCESS_TOKEN),
    chatId: envOrArray(process.env.TELEGRAM_CHAT_ID),
  },
  twilio: {
    accountSid: envOrString(process.env.TWILIO_ACCOUNT_SID),
    authToken: envOrString(process.env.TWILIO_AUTH_TOKEN),
    from: envOrString(process.env.TWILIO_FROM_NUMBER),
    to: envOrString(process.env.TWILIO_TO_NUMBER),
  },
  twitch: {
    accessToken: envOrString(process.env.TWITCH_ACCESS_TOKEN),
    channel: envOrString(process.env.TWITCH_CHANNEL),
    clientId: envOrString(process.env.TWITCH_CLIENT_ID),
    clientSecret: envOrString(process.env.TWITCH_CLIENT_SECRET),
    refreshToken: envOrString(process.env.TWITCH_REFRESH_TOKEN),
  },
  twitter: {
    accessTokenKey: envOrString(process.env.TWITTER_ACCESS_TOKEN_KEY),
    accessTokenSecret: envOrString(process.env.TWITTER_ACCESS_TOKEN_SECRET),
    consumerKey: envOrString(process.env.TWITTER_CONSUMER_KEY),
    consumerSecret: envOrString(process.env.TWITTER_CONSUMER_SECRET),
    tweetTags: envOrString(process.env.TWITTER_TWEET_TAGS),
  },
};

const nvidia = {
  addToCardAttempts: envOrNumber(process.env.NVIDIA_ADD_TO_CART_ATTEMPTS, 10),
  sessionTtl: envOrNumber(process.env.NVIDIA_SESSION_TTL, 60000),
};

const page = {
  height: 1080,
  inStockWaitTime: envOrNumber(process.env.IN_STOCK_WAIT_TIME),
  screenshot: envOrBoolean(process.env.SCREENSHOT),
  timeout: envOrNumber(process.env.PAGE_TIMEOUT, 30000),
  width: 1920,
};

const proxy = {
  address: envOrString(process.env.PROXY_ADDRESS),
  port: envOrNumber(process.env.PROXY_PORT, 80),
  protocol: envOrString(process.env.PROXY_PROTOCOL, 'http'),
};

// Check for deprecated configuration values
if (process.env.MAX_PRICE) {
  console.warn(
    'ℹ MAX_PRICE is deprecated, please use MAX_PRICE_SERIES_{{series}}'
  );
}

const store = {
  autoAddToCart: envOrBoolean(process.env.AUTO_ADD_TO_CART, true),
  country: envOrString(process.env.COUNTRY, 'usa'),
  maxPrice: {
    series: {
      '3060ti': envOrNumber(process.env.MAX_PRICE_SERIES_3060TI),
      3070: envOrNumber(process.env.MAX_PRICE_SERIES_3070),
      3080: envOrNumber(process.env.MAX_PRICE_SERIES_3080),
      3090: envOrNumber(process.env.MAX_PRICE_SERIES_3090),
      'captcha-deterrent': 0,
      darkhero: envOrNumber(process.env.MAX_PRICE_SERIES_DARKHERO),
      rx6800: envOrNumber(process.env.MAX_PRICE_SERIES_RX6800),
      rx6800xt: envOrNumber(process.env.MAX_PRICE_SERIES_RX6800XT),
      rx6900xt: envOrNumber(process.env.MAX_PRICE_SERIES_RX6900XT),
      ryzen5600: envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN5600),
      ryzen5800: envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN5800),
      ryzen5900: envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN5900),
      ryzen5950: envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN5950),
      sf: envOrNumber(process.env.MAX_PRICE_SERIES_CORSAIR_SF),
      sonyps5c: envOrNumber(process.env.MAX_PRICE_SERIES_SONYPS5C),
      sonyps5de: envOrNumber(process.env.MAX_PRICE_SERIES_SONYPS5DE),
      'test:series': envOrNumber(process.env.MAX_PRICE_SERIES_TEST),
      xboxss: envOrNumber(process.env.MAX_PRICE_SERIES_XBOXSS),
      xboxsx: envOrNumber(process.env.MAX_PRICE_SERIES_XBOXSX),
      // ---------------------------- //
			'5700xt': envOrNumber(process.env.MAX_PRICE_SERIES_5700XT),
			'3060TITRY': envOrNumber(process.env.MAX_PRICE_SERIES_3060TITRY),
			'3070TRY': envOrNumber(process.env.MAX_PRICE_SERIES_3070TRY),
			'3080TRY': envOrNumber(process.env.MAX_PRICE_SERIES_3080TRY),
			'3090TRY': envOrNumber(process.env.MAX_PRICE_SERIES_3090TRY),
			'RX6800TRY': envOrNumber(process.env.MAX_PRICE_SERIES_RX6800TRY),
			'RX6800XTTRY': envOrNumber(process.env.MAX_PRICE_SERIES_RX6800XTTRY),
			'RX6900XTTRY': envOrNumber(process.env.MAX_PRICE_SERIES_RX6900XTTRY),
			'RYZEN5600XTRY': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN5600XTRY),
			'RYZEN5800XTRY': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN5800XTRY),
			'RYZEN5900XTRY': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN5900XTRY),
			'RYZEN5950XTRY': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN5950XTRY),
			// ---------------------------- //
			'RYZEN3600': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN3600),
			'RYZEN3600X': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN3600X),
			'RYZEN3600XT': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN3600XT),
			'RYZEN3600TRY': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN3600TRY),
			'RYZEN3600XTRY': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN3600XTRY),
			'RYZEN3600XTTRY': envOrNumber(process.env.MAX_PRICE_SERIES_RYZEN3600XTTRY),
    },
  },
  microCenterLocation: envOrArray(process.env.MICROCENTER_LOCATION, ['web']),
  showOnlyBrands: envOrArray(process.env.SHOW_ONLY_BRANDS),
  showOnlyModels: envOrArray(process.env.SHOW_ONLY_MODELS).map(entry => {
    const [name, series] = entry.match(/[^:]+/g) ?? [];
    return {
      name: envOrString(name),
      series: envOrString(series),
    };
  }),
  showOnlySeries: envOrArray(process.env.SHOW_ONLY_SERIES, [
    '3060ti',
    '3070',
    '3080',
    '3090',
    'rx6800',
    'rx6800xt',
    'rx6900xt',
    'ryzen5600',
    'ryzen5800',
    'ryzen5900',
    'ryzen5950',
    'sf',
    'sonyps5c',
    'sonyps5de',
    'xboxss',
    'xboxsx',
    '5700xt',
		'3060TITRY',
		'3070TRY',
		'3080TRY',
		'3090TRY',
		'RX6800TRY',
		'RX6800XTTRY',
		'RX6900XTTRY',
		'RYZEN5600XTRY',
		'RYZEN5800XTRY',
		'RYZEN5900XTRY',
		'RYZEN5950XTRY',
		'RYZEN3600',
		'RYZEN3600X',
		'RYZEN3600XT',
		'RYZEN3600TRY',
		'RYZEN3600XTRY',
		'RYZEN3600XTTRY',
  ]),
  stores: envOrArray(process.env.STORES, ['amazon', 'bestbuy']).map(entry => {
    const [name, minPageSleep, maxPageSleep] = entry.match(/[^:]+/g) ?? [];

    let proxyList = loadProxyList(name);

    if (!proxyList) {
      proxyList = loadProxyList('global');
    }

    return {
      maxPageSleep: envOrNumberMax(
        minPageSleep,
        maxPageSleep,
        browser.maxSleep
      ),
      minPageSleep: envOrNumberMin(
        minPageSleep,
        maxPageSleep,
        browser.minSleep
      ),
      name: envOrString(name),
      proxyList,
    };
  }),
};

export const defaultStoreData = {
  maxPageSleep: browser.maxSleep,
  minPageSleep: browser.minSleep,
};

export const config = {
  browser,
  docker,
  logLevel,
  notifications,
  nvidia,
  page,
  proxy,
  store,
};

export function setConfig(newConfig: any) {
  const writeConfig = config as any;
  for (const key of Object.keys(newConfig)) {
    writeConfig[key] = newConfig[key];
  }
}
