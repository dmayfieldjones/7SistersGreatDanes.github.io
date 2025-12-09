(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_7Sisters_670591._.js", {

"[project]/app/7Sisters/WinPhotosCarousel.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>WinPhotosCarousel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
function WinPhotosCarousel({ photos, autoPlay = true, interval = 5000 }) {
    _s();
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isTransitioning, setIsTransitioning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Preload all images when component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WinPhotosCarousel.useEffect": ()=>{
            photos.forEach({
                "WinPhotosCarousel.useEffect": (photo)=>{
                    const img = new Image();
                    img.src = photo.src;
                }
            }["WinPhotosCarousel.useEffect"]);
        }
    }["WinPhotosCarousel.useEffect"], [
        photos
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WinPhotosCarousel.useEffect": ()=>{
            // Clear any existing timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            // Start timer if auto-play is enabled
            if (autoPlay && photos.length > 1) {
                timerRef.current = setInterval({
                    "WinPhotosCarousel.useEffect": ()=>{
                        setCurrentIndex({
                            "WinPhotosCarousel.useEffect": (prevIndex)=>(prevIndex + 1) % photos.length
                        }["WinPhotosCarousel.useEffect"]);
                    }
                }["WinPhotosCarousel.useEffect"], interval);
            }
            // Cleanup function
            return ({
                "WinPhotosCarousel.useEffect": ()=>{
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                }
            })["WinPhotosCarousel.useEffect"];
        }
    }["WinPhotosCarousel.useEffect"], [
        autoPlay,
        interval,
        photos.length
    ]);
    const resetTimer = ()=>{
        // Clear existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        // Restart timer if auto-play is enabled
        if (autoPlay && photos.length > 1) {
            timerRef.current = setInterval(()=>{
                setCurrentIndex((prevIndex)=>(prevIndex + 1) % photos.length);
            }, interval);
        }
    };
    const goToSlide = (index)=>{
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        resetTimer() // Reset timer when user manually navigates
        ;
        setTimeout(()=>setIsTransitioning(false), 300);
    };
    const goToPrevious = ()=>{
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex)=>prevIndex === 0 ? photos.length - 1 : prevIndex - 1);
        resetTimer() // Reset timer when user manually navigates
        ;
        setTimeout(()=>setIsTransitioning(false), 300);
    };
    const goToNext = ()=>{
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex)=>(prevIndex + 1) % photos.length);
        resetTimer() // Reset timer when user manually navigates
        ;
        setTimeout(()=>setIsTransitioning(false), 300);
    };
    if (!photos || photos.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "win-photos-carousel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "carousel-image-container",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "carousel-wrapper",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "carousel-slides",
                            children: photos.map((photo, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `carousel-slide ${index === currentIndex ? 'active' : ''}`,
                                    style: {
                                        transform: `translateX(-${currentIndex * 100}%)`,
                                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: photo.src,
                                        alt: photo.alt,
                                        className: "carousel-image",
                                        loading: index < 3 ? 'eager' : 'lazy',
                                        fetchPriority: index === 0 ? 'high' : index === 1 ? 'high' : 'auto'
                                    }, void 0, false, {
                                        fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this)
                                }, index, false, {
                                    fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this),
                        photos.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "carousel-arrow carousel-arrow-left",
                                    onClick: goToPrevious,
                                    "aria-label": "Previous image",
                                    children: "‹"
                                }, void 0, false, {
                                    fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                                    lineNumber: 132,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "carousel-arrow carousel-arrow-right",
                                    onClick: goToNext,
                                    "aria-label": "Next image",
                                    children: "›"
                                }, void 0, false, {
                                    fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                                    lineNumber: 139,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        photos.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "carousel-dots",
                            children: photos.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `carousel-dot ${index === currentIndex ? 'active' : ''}`,
                                    onClick: ()=>goToSlide(index),
                                    "aria-label": `Go to slide ${index + 1}`
                                }, index, false, {
                                    fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                                    lineNumber: 153,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                            lineNumber: 151,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            photos[currentIndex]?.caption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "carousel-caption",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: photos[currentIndex].caption
                }, void 0, false, {
                    fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                    lineNumber: 168,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
                lineNumber: 167,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/7Sisters/WinPhotosCarousel.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_s(WinPhotosCarousel, "y35rcuw37C3sNa5wfp/XkXl+Rxg=");
_c = WinPhotosCarousel;
var _c;
__turbopack_refresh__.register(_c, "WinPhotosCarousel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/7Sisters/ImagePreloader.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
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
function ImagePreloader({ images, priorityCount = 3 }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ImagePreloader.useEffect": ()=>{
            // Preload priority images first
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
"[project]/app/7Sisters/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=app_7Sisters_670591._.js.map