import multiEnvironmentIcon from "@/images/pages/book-a-demo-connect/enterprise-ready/icons/multi-environment.svg"
import scimIcon from "@/images/pages/book-a-demo-connect/enterprise-ready/icons/scim.svg"
import auditIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/audit.svg"
import enterpriseIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/enterprise.svg"
import ratesIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/rates.svg"
import rbacIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/rbac.svg"
import selfHostIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/self-host.svg"
import shieldIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/shield.svg"
import supportIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/support.svg"
import userLockIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/user-lock.svg"

import BookADemoEnterpriseReady from "@/components/pages/book-a-demo/enterprise-ready"

const ENTERPRISE_FEATURES = [
  {
    title: "SAML / SSO",
    icon: userLockIcon,
  },
  {
    title: "SCIM",
    icon: scimIcon,
  },
  {
    title: "Self-hosted option",
    icon: selfHostIcon,
  },
  {
    title: "RBAC",
    icon: rbacIcon,
  },
  {
    title: "Multi-environment support",
    icon: multiEnvironmentIcon,
  },
  {
    title: "Audit logs",
    icon: auditIcon,
  },
  {
    title: "Enterprise SLA",
    icon: enterpriseIcon,
  },
  {
    title: "Dedicated support",
    icon: supportIcon,
  },
  {
    title: "Security review support",
    icon: shieldIcon,
  },
  {
    title: "Custom rate limits",
    icon: ratesIcon,
  },
]

function BookADemoConnectEnterpriseReady() {
  return (
    <BookADemoEnterpriseReady
      className="mt-10 md:mt-10 lg:mt-40 xl:mt-63"
      complianceSchedulingSource="book_a_demo_connect"
      enterpriseFeatures={ENTERPRISE_FEATURES}
      schedulingSource="book_a_demo_connect"
      trackingBase="book_a_demo_connect_enterprise_ready"
    />
  )
}

export default BookADemoConnectEnterpriseReady
