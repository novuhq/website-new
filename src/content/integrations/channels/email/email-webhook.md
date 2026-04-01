---
slug: "email-webhook"
title: "Email Webhook"
tab: "channels"
category: "email"
badge: "Email"
tagline: "Integrate Email Webhook with custom HTTP endpoints."
shortDescription: "Route email events to a custom endpoint with Novu."
icon: "/images/integration-icons/email/email-webhook-icon.svg"
order: 17
docsUrl: "https://docs.novu.co/platform/integrations/email/webhook"
primaryCtaLabel: "Integrate Email Webhook"
relatedProviders:
  - "sendgrid"
  - "ses"
  - "postmark"
  - "resend"
relatedArticles: []
---

## Overview

Email Webhook forwards email notification payloads to a custom HTTP endpoint.

## How it works

Novu sends email payloads as HTTP POST requests to your webhook URL.

## Configure

Enter your webhook URL and secret HMAC key, sender email and name.
