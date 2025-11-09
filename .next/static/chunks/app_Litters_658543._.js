(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_Litters_658543._.js", {

"[project]/app/Litters/ImagePreloader.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ImagePreloader)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_refresh__.signature();
'use client';
;
function ImagePreloader({ images, priorityCount = 4 }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ImagePreloader.useEffect": ()=>{
            // Preload priority images first (visible above the fold)
            const priorityImages = images.slice(0, priorityCount);
            priorityImages.forEach({
                "ImagePreloader.useEffect": (src, index)=>{
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = src;
                    // Set high priority for first 2 images to ensure fast loading
                    if (index < 2) {
                        link.setAttribute('fetchpriority', 'high');
                    }
                    document.head.appendChild(link);
                }
            }["ImagePreloader.useEffect"]);
            // Prefetch remaining images
            const remainingImages = images.slice(priorityCount);
            remainingImages.forEach({
                "ImagePreloader.useEffect": (src)=>{
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.as = 'image';
                    link.href = src;
                    document.head.appendChild(link);
                }
            }["ImagePreloader.useEffect"]);
            // Also preload using Image objects for better browser support
            images.forEach({
                "ImagePreloader.useEffect": (src)=>{
                    const img = new Image();
                    img.src = src;
                }
            }["ImagePreloader.useEffect"]);
            // Cleanup function
            return ({
                "ImagePreloader.useEffect": ()=>{
                    // Remove preload links on unmount
                    document.querySelectorAll('link[rel="preload"][as="image"], link[rel="prefetch"][as="image"]').forEach({
                        "ImagePreloader.useEffect": (link)=>{
                            if (images.includes(link.getAttribute('href') || '')) {
                                link.remove();
                            }
                        }
                    }["ImagePreloader.useEffect"]);
                }
            })["ImagePreloader.useEffect"];
        }
    }["ImagePreloader.useEffect"], [
        images,
        priorityCount
    ]);
    return null;
}
_s(ImagePreloader, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ImagePreloader;
var _c;
__turbopack_refresh__.register(_c, "ImagePreloader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/Litters/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=app_Litters_658543._.js.map