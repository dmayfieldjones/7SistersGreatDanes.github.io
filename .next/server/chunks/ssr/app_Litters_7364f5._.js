module.exports = {

"[project]/app/Litters/ImagePreloader.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ImagePreloader)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function ImagePreloader({ images, priorityCount = 4 }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Preload priority images first (visible above the fold)
        const priorityImages = images.slice(0, priorityCount);
        priorityImages.forEach((src, index)=>{
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            // Set high priority for first 2 images to ensure fast loading
            if (index < 2) {
                link.setAttribute('fetchpriority', 'high');
            }
            document.head.appendChild(link);
        });
        // Prefetch remaining images
        const remainingImages = images.slice(priorityCount);
        remainingImages.forEach((src)=>{
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
        // Also preload using Image objects for better browser support
        images.forEach((src)=>{
            const img = new Image();
            img.src = src;
        });
        // Cleanup function
        return ()=>{
            // Remove preload links on unmount
            document.querySelectorAll('link[rel="preload"][as="image"], link[rel="prefetch"][as="image"]').forEach((link)=>{
                if (images.includes(link.getAttribute('href') || '')) {
                    link.remove();
                }
            });
        };
    }, [
        images,
        priorityCount
    ]);
    return null;
}
}}),
"[project]/app/Litters/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules ssr)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),

};

//# sourceMappingURL=app_Litters_7364f5._.js.map