(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_b65722._.js", {

"[project]/app/components/AnimatedContent.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>AnimatedContent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
function AnimatedContent({ children }) {
    _s();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const sectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedContent.useEffect": ()=>{
            const observer = new IntersectionObserver({
                "AnimatedContent.useEffect": (entries)=>{
                    entries.forEach({
                        "AnimatedContent.useEffect": (entry)=>{
                            if (entry.isIntersecting) {
                                setIsVisible(true);
                                // Once visible, we can stop observing
                                observer.unobserve(entry.target);
                            }
                        }
                    }["AnimatedContent.useEffect"]);
                }
            }["AnimatedContent.useEffect"], {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            if (sectionRef.current) {
                observer.observe(sectionRef.current);
            }
            return ({
                "AnimatedContent.useEffect": ()=>{
                    if (sectionRef.current) {
                        observer.unobserve(sectionRef.current);
                    }
                }
            })["AnimatedContent.useEffect"];
        }
    }["AnimatedContent.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: sectionRef,
        className: `content-section ${isVisible ? 'content-visible' : ''}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/AnimatedContent.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(AnimatedContent, "t6xTCIDW8wBKaEAVt1RBRErIU/M=");
_c = AnimatedContent;
var _c;
__turbopack_refresh__.register(_c, "AnimatedContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/ScrollIndicator.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ScrollIndicator)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function ScrollIndicator() {
    const handleScroll = ()=>{
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "scroll-indicator",
        onClick: handleScroll,
        role: "button",
        "aria-label": "Scroll down to see more",
        tabIndex: 0,
        onKeyDown: (e)=>{
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleScroll();
            }
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scroll-arrow"
            }, void 0, false, {
                fileName: "[project]/app/components/ScrollIndicator.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "scroll-text",
                children: "Scroll"
            }, void 0, false, {
                fileName: "[project]/app/components/ScrollIndicator.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ScrollIndicator.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = ScrollIndicator;
var _c;
__turbopack_refresh__.register(_c, "ScrollIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/EnsureScrollable.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>EnsureScrollable)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_refresh__.signature();
'use client';
;
function EnsureScrollable() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EnsureScrollable.useEffect": ()=>{
            // Simple approach: just try to activate scroll recognition
            // Don't intercept wheel events - let them work normally
            const activateScroll = {
                "EnsureScrollable.useEffect.activateScroll": ()=>{
                    if (window.scrollY === 0) {
                        const scrollHeight = document.documentElement.scrollHeight;
                        const clientHeight = document.documentElement.clientHeight;
                        if (scrollHeight > clientHeight) {
                            // Force scroll activation by briefly scrolling
                            window.scrollTo(0, 0.1);
                            requestAnimationFrame({
                                "EnsureScrollable.useEffect.activateScroll": ()=>{
                                    window.scrollTo(0, 0);
                                }
                            }["EnsureScrollable.useEffect.activateScroll"]);
                        }
                    }
                }
            }["EnsureScrollable.useEffect.activateScroll"];
            // Try multiple times
            activateScroll();
            const timeout1 = setTimeout(activateScroll, 50);
            const timeout2 = setTimeout(activateScroll, 200);
            const timeout3 = setTimeout(activateScroll, 500);
            window.addEventListener('load', activateScroll, {
                once: true
            });
            return ({
                "EnsureScrollable.useEffect": ()=>{
                    clearTimeout(timeout1);
                    clearTimeout(timeout2);
                    clearTimeout(timeout3);
                    window.removeEventListener('load', activateScroll);
                }
            })["EnsureScrollable.useEffect"];
        }
    }["EnsureScrollable.useEffect"], []);
    return null;
}
_s(EnsureScrollable, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = EnsureScrollable;
var _c;
__turbopack_refresh__.register(_c, "EnsureScrollable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=app_b65722._.js.map