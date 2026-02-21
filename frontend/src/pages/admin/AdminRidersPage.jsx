import { useState, useEffect, useRef } from "react";
import {
    Bike,
    CheckCircle,
    XCircle,
    Package,
    TrendingUp,
    PhoneCall,
    Mail,
    ToggleLeft,
    ToggleRight,
    RefreshCw,
} from "lucide-react";
import { adminApi } from "../../api";
import { formatDate } from "../../utils/helpers";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { RidersSkeleton } from "../../components/ui/AdminSkeletons";
import toast from "react-hot-toast";

const AdminRidersPage = () => {
    const [allRiders, setAllRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [togglingId, setTogglingId] = useState(null);
    const initialized = useRef(false);

    useEffect(() => {
        loadRiders(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadRiders = async (isInitial = false) => {
        if (isInitial) {
            setLoading(true);
        } else {
            setFetching(true);
        }
        try {
            // Always fetch all riders; filtering is done client-side
            const response = await adminApi.getAllRiders({ status: "all" });
            setAllRiders(response.data);
            initialized.current = true;
        } catch {
            toast.error("Failed to fetch riders");
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    const handleToggleStatus = async (rider) => {
        setTogglingId(rider._id);
        try {
            await adminApi.toggleRiderStatus(rider._id);
            // Optimistically flip status in local state — no re-fetch needed
            setAllRiders((prev) =>
                prev.map((r) =>
                    r._id === rider._id ? { ...r, isActive: !r.isActive } : r
                )
            );
            toast.success(
                `${rider.name} has been ${rider.isActive ? "deactivated" : "activated"}`
            );
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to toggle rider status");
        } finally {
            setTogglingId(null);
        }
    };

    if (loading) {
        return <RidersSkeleton />;
    }

    // Client-side filter — instant, no spinner
    const riders =
        statusFilter === "active"
            ? allRiders.filter((r) => r.isActive)
            : statusFilter === "inactive"
                ? allRiders.filter((r) => !r.isActive)
                : allRiders;

    const activeCount = allRiders.filter((r) => r.isActive).length;
    const inactiveCount = allRiders.filter((r) => !r.isActive).length;

    const filterOptions = [
        { value: "all", label: "All Riders" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Riders</h1>
                    <p className="text-gray-500">Manage delivery riders</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadRiders(false)}
                    disabled={fetching}
                    className="flex items-center gap-2 self-start"
                >
                    <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
                    {fetching ? "Refreshing..." : "Refresh"}
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Bike className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Riders</p>
                        <p className="text-2xl font-bold text-gray-900">{riders.length}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Active</p>
                        <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Inactive</p>
                        <p className="text-2xl font-bold text-gray-900">{inactiveCount}</p>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-wrap gap-3">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === option.value
                                ? "bg-primary-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Riders Table */}
            <Card className="overflow-hidden">
                <div className={`overflow-x-auto relative transition-opacity duration-200 ${fetching ? "opacity-50 pointer-events-none" : ""}`}>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Rider
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Contact
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Total Orders
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Delivered
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Active Orders
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Joined
                                </th>
                                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {riders.map((rider) => {
                                const activeOrders =
                                    (rider.deliveryStats?.assigned || 0) +
                                    (rider.deliveryStats?.out_for_delivery || 0);
                                const successRate =
                                    rider.deliveryStats?.total > 0
                                        ? Math.round(
                                            ((rider.deliveryStats.delivered || 0) /
                                                rider.deliveryStats.total) *
                                            100
                                        )
                                        : 0;

                                return (
                                    <tr key={rider._id} className="hover:bg-gray-50">
                                        {/* Rider Info */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold shrink-0">
                                                    {rider.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {rider.name}
                                                    </p>
                                                    {rider.deliveryStats?.total > 0 && (
                                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                            <TrendingUp className="h-3 w-3" />
                                                            {successRate}% success rate
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-5 py-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                    {rider.email}
                                                </p>
                                                {rider.phone && (
                                                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                                        <PhoneCall className="h-3.5 w-3.5 text-gray-400" />
                                                        {rider.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Total Orders */}
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Package className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">
                                                    {rider.deliveryStats?.total || 0}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Delivered */}
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-medium text-green-700">
                                                {rider.deliveryStats?.delivered || 0}
                                            </span>
                                        </td>

                                        {/* Active Orders */}
                                        <td className="px-5 py-4 text-center">
                                            {activeOrders > 0 ? (
                                                <Badge variant="info">{activeOrders} active</Badge>
                                            ) : (
                                                <span className="text-gray-400 text-sm">—</span>
                                            )}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-5 py-4 text-center">
                                            <Badge variant={rider.isActive ? "success" : "danger"}>
                                                {rider.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            {formatDate(rider.createdAt)}
                                        </td>

                                        {/* Toggle Action */}
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(rider)}
                                                disabled={togglingId === rider._id}
                                                title={
                                                    rider.isActive ? "Deactivate rider" : "Activate rider"
                                                }
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${rider.isActive
                                                    ? "text-red-600 hover:bg-red-50"
                                                    : "text-green-600 hover:bg-green-50"
                                                    }`}
                                            >
                                                {togglingId === rider._id ? (
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                ) : rider.isActive ? (
                                                    <>
                                                        <ToggleRight className="h-4 w-4" />
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleLeft className="h-4 w-4" />
                                                        Activate
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {riders.length === 0 && (
                        <div className="py-16 text-center">
                            <Bike className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No riders found
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {statusFilter === "all"
                                    ? "No riders have been registered yet."
                                    : `No ${statusFilter} riders at the moment.`}
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminRidersPage;
