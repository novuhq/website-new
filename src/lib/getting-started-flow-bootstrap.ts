import {
  GETTING_STARTED_FLOW_ASSIGNMENT_EVENT,
  GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
  GETTING_STARTED_FLOW_CLI_UPPER_BOUND,
  GETTING_STARTED_FLOW_COOKIE_MAX_AGE_SECONDS,
  GETTING_STARTED_FLOW_COOKIE_NAME,
  GETTING_STARTED_FLOW_EVENT_ENDPOINT,
  GETTING_STARTED_FLOW_EXPERIMENT_KEY,
  GETTING_STARTED_FLOW_EXPOSED_EVENT,
  GETTING_STARTED_FLOW_QA_PARAM,
  GETTING_STARTED_FLOW_SELECTED_EVENT,
  GETTING_STARTED_FLOW_UI_UPPER_BOUND,
  GETTING_STARTED_FLOW_VARIANTS,
  SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
  SEGMENT_ANONYMOUS_ID_MAX_AGE_SECONDS,
  WEBSITE_CLI_COMMAND_COPIED_EVENT,
  WEBSITE_PROMPT_COPIED_EVENT,
} from "@/lib/getting-started-flow-experiment"

interface BuildBootstrapScriptOptions {
  enabled: boolean
  qaEnabled: boolean
}

/**
 * Runs synchronously before the homepage hero markup is parsed. It only
 * decides which already-rendered CTA is visible; third-party requests stay out
 * of the rendering path.
 */
export function buildGettingStartedFlowBootstrapScript({
  enabled,
  qaEnabled,
}: BuildBootstrapScriptOptions): string {
  const config = JSON.stringify({
    applyGlobal: "__novuApplyGettingStartedFlow",
    assignmentGlobal: "__novuGettingStartedFlowAssignment",
    assignmentEvent: GETTING_STARTED_FLOW_ASSIGNMENT_EVENT,
    assignmentVersion: GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
    cliCopiedEvent: WEBSITE_CLI_COMMAND_COPIED_EVENT,
    cliUpperBound: GETTING_STARTED_FLOW_CLI_UPPER_BOUND,
    clickListenerGlobal: "__novuGettingStartedFlowClickListenerInstalled",
    cookieMaxAge: GETTING_STARTED_FLOW_COOKIE_MAX_AGE_SECONDS,
    cookieName: GETTING_STARTED_FLOW_COOKIE_NAME,
    enabled,
    eventEndpoint: GETTING_STARTED_FLOW_EVENT_ENDPOINT,
    eventQueueGlobal: "__novuGettingStartedFlowEventQueue",
    experimentKey: GETTING_STARTED_FLOW_EXPERIMENT_KEY,
    exposedEvent: GETTING_STARTED_FLOW_EXPOSED_EVENT,
    exposureGlobal: "__novuGettingStartedFlowExposureKey",
    homepagePath: "/",
    hydratedGlobal: "__novuGettingStartedFlowHydrated",
    promptCopiedEvent: WEBSITE_PROMPT_COPIED_EVENT,
    qaEnabled,
    qaParam: GETTING_STARTED_FLOW_QA_PARAM,
    rootAttribute: "data-getting-started-flow",
    rootCopyFeedbackAttribute: "data-getting-started-flow-copy-feedback",
    selectedEvent: GETTING_STARTED_FLOW_SELECTED_EVENT,
    segmentAnonymousCookieMaxAge: SEGMENT_ANONYMOUS_ID_MAX_AGE_SECONDS,
    segmentAnonymousCookieName: SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
    segmentAnonymousGlobal: "__novuSegmentAnonymousId",
    trackGlobal: "__novuTrackGettingStartedFlowEvent",
    uiUpperBound: GETTING_STARTED_FLOW_UI_UPPER_BOUND,
    variants: GETTING_STARTED_FLOW_VARIANTS,
  })

  return `
(function () {
  var config = ${config};
  var root = document.documentElement;
  var isVariant = function (value) {
    return config.variants.indexOf(value) !== -1;
  };
  var readCookie = function (name) {
    try {
      var cookiePrefix = name + "=";
      var cookies = document.cookie ? document.cookie.split(";") : [];
      for (var index = 0; index < cookies.length; index += 1) {
        var cookie = cookies[index].trim();
        if (cookie.indexOf(cookiePrefix) === 0) {
          return cookie.slice(cookiePrefix.length);
        }
      }
    } catch (_) {}
    return null;
  };
  var createId = function () {
    try {
      if (typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
      }
    } catch (_) {}
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  };
  var parseAnonymousId = function (storedValue) {
    if (!storedValue) return null;

    try {
      var parsedValue = JSON.parse(decodeURIComponent(storedValue));
      if (typeof parsedValue === "string" && parsedValue) {
        return parsedValue;
      }
    } catch (_) {
      if (storedValue.length <= 128) return storedValue;
    }

    return null;
  };
  var getAnonymousId = function () {
    if (window[config.segmentAnonymousGlobal]) {
      return window[config.segmentAnonymousGlobal];
    }

    var anonymousId = null;

    try {
      anonymousId = parseAnonymousId(
        window.localStorage.getItem(config.segmentAnonymousCookieName)
      );
    } catch (_) {}

    if (!anonymousId) {
      anonymousId = parseAnonymousId(
        readCookie(config.segmentAnonymousCookieName)
      );
    }

    if (!anonymousId) anonymousId = createId();
    window[config.segmentAnonymousGlobal] = anonymousId;

    try {
      window.localStorage.setItem(
        config.segmentAnonymousCookieName,
        JSON.stringify(anonymousId)
      );
    } catch (_) {}

    try {
      var hostname = window.location.hostname;
      var sharedDomain = hostname === "novu.co"
        || hostname.slice(-8) === ".novu.co";
      document.cookie = config.segmentAnonymousCookieName + "="
        + encodeURIComponent(JSON.stringify(anonymousId))
        + "; Max-Age=" + config.segmentAnonymousCookieMaxAge
        + "; Path=/; SameSite=Lax"
        + (sharedDomain ? "; Domain=.novu.co" : "")
        + (window.location.protocol === "https:" ? "; Secure" : "");
    } catch (_) {}

    return anonymousId;
  };
  var copyText = function (value, onSuccess) {
    var fallback = function () {
      var input = null;

      try {
        input = document.createElement("textarea");
        input.value = value;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();

        var copied = document.execCommand("copy");
        input.remove();
        if (copied) onSuccess();
        return copied;
      } catch (_) {
        if (input && input.parentNode) input.parentNode.removeChild(input);
        return false;
      }
    };

    try {
      var clipboard = window.navigator && window.navigator.clipboard;
      if (clipboard && typeof clipboard.writeText === "function") {
        var result = clipboard.writeText(value);
        if (result && typeof result.then === "function") {
          result.then(onSuccess, fallback);
          return true;
        }
        onSuccess();
        return true;
      }
    } catch (_) {}

    return fallback();
  };
  var showCopyFeedback = function (action) {
    root.setAttribute(config.rootCopyFeedbackAttribute, action);

    try {
      var feedbackId = "getting-started-flow-copy-feedback";
      var previousFeedback = document.getElementById(feedbackId);
      if (previousFeedback) previousFeedback.remove();

      var feedback = document.createElement("span");
      feedback.id = feedbackId;
      feedback.setAttribute("role", "status");
      feedback.setAttribute("aria-live", "polite");
      feedback.style.position = "fixed";
      feedback.style.width = "1px";
      feedback.style.height = "1px";
      feedback.style.padding = "0";
      feedback.style.margin = "-1px";
      feedback.style.overflow = "hidden";
      feedback.style.clip = "rect(0, 0, 0, 0)";
      feedback.style.whiteSpace = "nowrap";
      feedback.style.border = "0";
      feedback.textContent = action === "copy_cli"
        ? "Command copied to clipboard"
        : "Prompt copied to clipboard";
      document.body.appendChild(feedback);

      window.setTimeout(function () {
        if (root.getAttribute(config.rootCopyFeedbackAttribute) === action) {
          root.removeAttribute(config.rootCopyFeedbackAttribute);
        }
        feedback.remove();
      }, 2000);
    } catch (_) {}
  };
  var sendBeacon = function (body) {
    try {
      var navigator = window.navigator;
      if (!navigator || typeof navigator.sendBeacon !== "function") {
        return false;
      }
      var data = typeof window.Blob === "function"
        ? new window.Blob([body], { type: "application/json" })
        : body;
      return navigator.sendBeacon(config.eventEndpoint, data);
    } catch (_) {
      return false;
    }
  };
  var deliver = function (event, properties, assignment) {
    var body = JSON.stringify({
      anonymousId: getAnonymousId(),
      assignment: assignment,
      event: event,
      messageId: "gsf-" + createId(),
      properties: properties
    });

    if (typeof window.fetch === "function") {
      try {
        var request = window.fetch(config.eventEndpoint, {
          body: body,
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          method: "POST"
        });
        if (request && typeof request.then === "function") {
          request.then(function (response) {
            if (!response.ok) sendBeacon(body);
          }).catch(function () { sendBeacon(body); });
        }
        return true;
      } catch (_) {}
    }

    if (sendBeacon(body)) return true;

    var queue = window[config.eventQueueGlobal]
      || (window[config.eventQueueGlobal] = []);
    queue.push({ event: event, properties: properties });
    return true;
  };
  var track = function (event, properties) {
    var assignment = window[config.assignmentGlobal];
    if (!assignment || !isVariant(assignment.variant)) return false;

    var payload = {
      experiment_key: config.experimentKey,
      assignment_version: config.assignmentVersion,
      getting_started_flow: assignment.variant,
      variant: assignment.variant,
      assignment_source: assignment.source,
      is_qa: assignment.isQa
    };

    if (properties) {
      for (var property in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, property)) {
          payload[property] = properties[property];
        }
      }
    }

    return deliver(event, payload, assignment);
  };

  var expose = function () {
    if (window.location.pathname !== config.homepagePath) return;

    var assignment = window[config.assignmentGlobal];
    if (!assignment || !isVariant(assignment.variant)) return;

    var exposureKey = [
      config.experimentKey,
      config.assignmentVersion,
      assignment.variant,
      assignment.isQa ? "qa" : "production"
    ].join(":");

    if (window[config.exposureGlobal] === exposureKey) return;
    if (track(config.exposedEvent)) {
      window[config.exposureGlobal] = exposureKey;
    }
  };

  var apply = function () {
    var override = null;

    try {
      override = new URLSearchParams(window.location.search).get(config.qaParam);
    } catch (_) {}

    if (config.qaEnabled && isVariant(override)) {
      root.setAttribute(config.rootAttribute, override);
      window[config.assignmentGlobal] = {
        isQa: true,
        source: "qa",
        variant: override
      };
    } else if (!config.enabled) {
      root.removeAttribute(config.rootAttribute);
      delete window[config.assignmentGlobal];
    } else {
      var cookieValue = readCookie(config.cookieName);

      var source = "cookie";
      var variant = cookieValue;

      if (!isVariant(variant)) {
        source = "random";
        var randomValue = Math.random();

        try {
          var values = new Uint32Array(1);
          window.crypto.getRandomValues(values);
          randomValue = values[0] / 4294967296;
        } catch (_) {}

        variant = randomValue < config.uiUpperBound
          ? "ui"
          : randomValue < config.cliUpperBound
            ? "cli"
            : "prompt";

        try {
          document.cookie = config.cookieName + "=" + variant
            + "; Max-Age=" + config.cookieMaxAge
            + "; Path=/; SameSite=Lax"
            + (window.location.protocol === "https:" ? "; Secure" : "");
        } catch (_) {}
      }

      root.setAttribute(config.rootAttribute, variant);
      window[config.assignmentGlobal] = {
        isQa: false,
        source: source,
        variant: variant
      };
    }

    expose();
    try {
      window.dispatchEvent(new CustomEvent(config.assignmentEvent));
    } catch (_) {}
  };

  window[config.applyGlobal] = apply;
  window[config.trackGlobal] = track;

  if (!window[config.clickListenerGlobal]) {
    window[config.clickListenerGlobal] = true;
    var getEventTarget = function (event) {
      var target = event.target;
      return target && typeof target.closest === "function" ? target : null;
    };
    var prepareSignupFromEvent = function (event) {
      var target = getEventTarget(event);
      if (!target) return;

      var signupTarget = target.closest("a[data-getting-started-flow-signup]");
      if (signupTarget) {
        try {
          var signupUrl = new URL(signupTarget.href, window.location.href);
          if (signupUrl.hostname === "dashboard.novu.co") {
            signupUrl.searchParams.set("ajs_aid", getAnonymousId());
            signupTarget.href = signupUrl.toString();
          }
        } catch (_) {}
      }
    };
    var trackActionFromEvent = function (event) {
      var target = getEventTarget(event);
      if (!target) return;

      var actionTarget = target.closest("[data-getting-started-flow-action]");
      if (!actionTarget) return;

      var action = actionTarget.getAttribute("data-getting-started-flow-action");
      if (!action) return;

      if ((action === "copy_cli" || action === "copy_prompt")
        && !window[config.hydratedGlobal]) {
        var copyValue = actionTarget.getAttribute(
          "data-getting-started-flow-copy-value"
        );
        if (!copyValue) return;

        var copyStarted = copyText(copyValue, function () {
          showCopyFeedback(action);
          track(config.selectedEvent, { action: action });
          track(
            action === "copy_cli"
              ? config.cliCopiedEvent
              : config.promptCopiedEvent,
            action === "copy_cli"
              ? { command: copyValue }
              : { prompt: copyValue }
          );
        });

        if (copyStarted) {
          event.preventDefault();
          event.stopPropagation();
          if (typeof event.stopImmediatePropagation === "function") {
            event.stopImmediatePropagation();
          }
        }
        return;
      }

      if (action === "copy_cli" || action === "copy_prompt") return;

      track(config.selectedEvent, { action: action });
    };

    document.addEventListener("pointerdown", function (event) {
      if (event.button === 1) prepareSignupFromEvent(event);
    }, true);
    document.addEventListener("auxclick", function (event) {
      if (event.button !== 1) return;
      prepareSignupFromEvent(event);
      trackActionFromEvent(event);
    }, true);
    document.addEventListener("click", function (event) {
      prepareSignupFromEvent(event);
      trackActionFromEvent(event);
    }, true);
  }

  apply();
})();`
}

export const GETTING_STARTED_FLOW_VISIBILITY_CSS = `
html [data-getting-started-flow-variant] {
  display: none;
}

html:not([data-getting-started-flow="ui"]):not([data-getting-started-flow="cli"]):not([data-getting-started-flow="prompt"])
  [data-getting-started-flow-variant="baseline"],
html[data-getting-started-flow="ui"]
  [data-getting-started-flow-variant="ui"],
html[data-getting-started-flow="cli"]
  [data-getting-started-flow-variant="cli"],
html[data-getting-started-flow="prompt"]
  [data-getting-started-flow-variant="prompt"] {
  display: flex;
}

html[data-getting-started-flow-copy-feedback="copy_cli"]
  button[data-getting-started-flow-action="copy_cli"],
html[data-getting-started-flow-copy-feedback="copy_prompt"]
  button[data-getting-started-flow-action="copy_prompt"] {
  color: transparent !important;
  position: relative;
}

html[data-getting-started-flow-copy-feedback="copy_cli"]
  button[data-getting-started-flow-action="copy_cli"] > *,
html[data-getting-started-flow-copy-feedback="copy_prompt"]
  button[data-getting-started-flow-action="copy_prompt"] > * {
  visibility: hidden;
}

html[data-getting-started-flow-copy-feedback="copy_cli"]
  button[data-getting-started-flow-action="copy_cli"]::after,
html[data-getting-started-flow-copy-feedback="copy_prompt"]
  button[data-getting-started-flow-action="copy_prompt"]::after {
  align-items: center;
  color: #000;
  content: "Copied";
  display: flex;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  inset: 0;
  justify-content: center;
  line-height: 1;
  position: absolute;
  z-index: 30;
}
`
