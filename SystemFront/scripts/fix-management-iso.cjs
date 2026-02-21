const fs = require("fs");
const p = "app/management/page.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(
  'import { useState } from "react";',
  'import { useState, useEffect } from "react";\nimport { useRouter, useSearchParams } from "next/navigation";'
);

c = c.replace(
  /  \{ id: "iso", labelKey: "management\.isoGuide", icon: "menu_book" \},\n  /,
  ""
);

c = c.replace(
  /      case "iso":\s*\n\s*return <GuidelineView \/>;\s*\n      /,
  ""
);

c = c.replace(
  "      default:\n        return <ContextPage selectedSideTab={sideTab} />;",
  '      default:\n        return <ContextPage selectedSideTab={sideTab} />;'
);

fs.writeFileSync(p, c);
console.log("Done: removed iso tab and GuidelineView from management");
