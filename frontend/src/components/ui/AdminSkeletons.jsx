/**
 * Shared skeleton primitives and page-level skeletons for the admin panel.
 * Usage: import { DashboardSkeleton } from "../../components/ui/AdminSkeletons";
 */

// ─── Base pulse block ────────────────────────────────────────────────────────
const Sk = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// ─── Shared sub-atoms ────────────────────────────────────────────────────────
const SkRow = ({ cols = 5 }) => (
    <tr className="border-b border-gray-100">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="px-5 py-4">
                <Sk className="h-4 w-full" />
            </td>
        ))}
    </tr>
);

const SkTableHead = ({ cols }) => (
    <thead className="bg-gray-50">
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-5 py-3">
                    <Sk className="h-3 w-20" />
                </th>
            ))}
        </tr>
    </thead>
);

// ─── Dashboard Skeleton ──────────────────────────────────────────────────────
export const DashboardSkeleton = () => (
    <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
            <Sk className="h-8 w-40" />
            <Sk className="h-4 w-64" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Sk className="h-12 w-12 rounded-xl" />
                        <Sk className="h-4 w-12" />
                    </div>
                    <Sk className="h-7 w-24 mb-2" />
                    <Sk className="h-3 w-28" />
                </div>
            ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex justify-between mb-4">
                <Sk className="h-5 w-32" />
                <Sk className="h-4 w-16" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-4 flex flex-col items-center gap-3">
                        <Sk className="h-12 w-12 rounded-lg" />
                        <Sk className="h-4 w-24" />
                        <Sk className="h-3 w-32" />
                    </div>
                ))}
            </div>
        </div>

        {/* Two column — recent orders + low stock */}
        <div className="grid lg:grid-cols-2 gap-6">
            {[0, 1].map((col) => (
                <div key={col} className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex justify-between mb-4">
                        <Sk className="h-5 w-32" />
                        <Sk className="h-4 w-16" />
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                                <div className="space-y-1.5">
                                    <Sk className="h-4 w-28" />
                                    <Sk className="h-3 w-20" />
                                </div>
                                <div className="space-y-1.5 items-end flex flex-col">
                                    <Sk className="h-4 w-16" />
                                    <Sk className="h-5 w-14 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ─── Orders Skeleton ─────────────────────────────────────────────────────────
export const OrdersSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-1">
            <Sk className="h-8 w-28" />
            <Sk className="h-4 w-44" />
        </div>

        {/* Filter chips */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex gap-3">
                {Array.from({ length: 7 }).map((_, i) => (
                    <Sk key={i} className="h-9 w-20 rounded-lg" />
                ))}
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <SkTableHead cols={7} />
                    <tbody>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkRow key={i} cols={7} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// ─── Products Skeleton ───────────────────────────────────────────────────────
export const ProductsSkeleton = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="space-y-1">
                <Sk className="h-8 w-32" />
                <Sk className="h-4 w-44" />
            </div>
            <Sk className="h-10 w-32 rounded-lg" />
        </div>

        {/* Search + filter bar */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3">
            <Sk className="h-10 w-64 rounded-lg" />
            <Sk className="h-10 w-36 rounded-lg" />
            <Sk className="h-10 w-36 rounded-lg" />
        </div>

        {/* Product table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <SkTableHead cols={7} />
                    <tbody>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <tr key={i} className="border-b border-gray-100">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <Sk className="h-12 w-12 rounded-lg shrink-0" />
                                        <div className="space-y-1.5">
                                            <Sk className="h-4 w-32" />
                                            <Sk className="h-3 w-20" />
                                        </div>
                                    </div>
                                </td>
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <td key={j} className="px-5 py-4">
                                        <Sk className="h-4 w-full" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// ─── Riders Skeleton ─────────────────────────────────────────────────────────
export const RidersSkeleton = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="space-y-1">
                <Sk className="h-8 w-24" />
                <Sk className="h-4 w-44" />
            </div>
            <Sk className="h-10 w-24 rounded-lg" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                    <Sk className="h-12 w-12 rounded-full shrink-0" />
                    <div className="space-y-1.5">
                        <Sk className="h-3 w-20" />
                        <Sk className="h-7 w-10" />
                    </div>
                </div>
            ))}
        </div>

        {/* Filter chips */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Sk key={i} className="h-9 w-24 rounded-lg" />
                ))}
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <SkTableHead cols={8} />
                    <tbody>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <tr key={i} className="border-b border-gray-100">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <Sk className="h-10 w-10 rounded-full shrink-0" />
                                        <div className="space-y-1.5">
                                            <Sk className="h-4 w-28" />
                                            <Sk className="h-3 w-20" />
                                        </div>
                                    </div>
                                </td>
                                {Array.from({ length: 7 }).map((_, j) => (
                                    <td key={j} className="px-5 py-4">
                                        <Sk className="h-4 w-full" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// ─── Order Detail Skeleton ───────────────────────────────────────────────────
export const OrderDetailSkeleton = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Sk className="h-10 w-32 rounded-lg" />
                <div className="space-y-1.5">
                    <Sk className="h-7 w-48" />
                    <Sk className="h-4 w-36" />
                </div>
            </div>
            <div className="flex gap-3">
                <Sk className="h-8 w-20 rounded-full" />
                <Sk className="h-10 w-32 rounded-lg" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col */}
            <div className="lg:col-span-2 space-y-6">
                {/* Progress card */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
                    <Sk className="h-5 w-36" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <Sk className="h-12 w-12 rounded-full shrink-0" />
                            <div className="space-y-1.5 pt-1">
                                <Sk className="h-4 w-24" />
                                <Sk className="h-3 w-16" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Items card */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <Sk className="h-5 w-28" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <Sk className="h-16 w-16 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <Sk className="h-4 w-40" />
                                <Sk className="h-3 w-28" />
                            </div>
                            <Sk className="h-5 w-16" />
                        </div>
                    ))}
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <Sk className="h-4 w-20" />
                                <Sk className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right col */}
            <div className="space-y-6">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                        <Sk className="h-5 w-36" />
                        {Array.from({ length: 3 }).map((_, j) => (
                            <div key={j} className="flex gap-3">
                                <Sk className="h-5 w-5 rounded shrink-0 mt-0.5" />
                                <div className="space-y-1.5">
                                    <Sk className="h-3 w-12" />
                                    <Sk className="h-4 w-36" />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);
