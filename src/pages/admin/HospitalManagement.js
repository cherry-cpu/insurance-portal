import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {
  apiGet,
  apiPost,
  addHospitalPackage,
  addHospitalContract,
  getHospitalPackages,
  getHospitalContracts,
} from "../../api/client";

const tiers = ["TIER_1", "TIER_2", "TIER_3"];
const networkTypes = ["NON_NETWORK", "CASHLESS_NETWORK", "PREFERRED_NETWORK"];

export default function HospitalManagement() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [mappings, setMappings] = useState([]);
  const [tariffs, setTariffs] = useState([]);
  const [packages, setPackages] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  const [hospitalForm, setHospitalForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    tier: "TIER_1",
    networkType: "NON_NETWORK",
    standardRoomRentLimit: "",
    premiumRoomRentLimit: "",
  });

  const [mappingForm, setMappingForm] = useState({
    hospitalId: "",
    productId: "",
    isCashless: true,
  });

  const [tariffForm, setTariffForm] = useState({
    hospitalId: "",
    procedureName: "",
    maxCoverage: "",
    effectiveDate: "",
  });

  const [packageForm, setPackageForm] = useState({
    hospitalId: "",
    packageCode: "",
    procedureName: "",
    packageRate: "",
    effectiveDate: "",
    currency: "INR",
  });

  const [contractForm, setContractForm] = useState({
    hospitalId: "",
    contractName: "",
    contractVersion: "",
    contractFileKey: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      const result = await apiGet("/api/hospitals");
      setHospitals(result);
      if (result.length) {
        const id = result[0].id.toString();
        setMappingForm((prev) => ({ ...prev, hospitalId: prev.hospitalId || id }));
        setTariffForm((prev) => ({ ...prev, hospitalId: prev.hospitalId || id }));
        setPackageForm((prev) => ({ ...prev, hospitalId: prev.hospitalId || id }));
        setContractForm((prev) => ({ ...prev, hospitalId: prev.hospitalId || id }));
      }
      setStatusMessage("");
    } catch (error) {
      setStatusMessage(error.message || "Unable to load hospitals.");
    }
  };

  const refreshHospitalDetails = async (hospitalId) => {
    if (!hospitalId) return;
    try {
      const [maps, tffs, pkgs, ctcs] = await Promise.all([
        apiGet(`/api/hospitals/${hospitalId}/mappings`),
        apiGet(`/api/hospitals/${hospitalId}/tariffs`),
        getHospitalPackages(hospitalId),
        getHospitalContracts(hospitalId),
      ]);
      setMappings(maps);
      setTariffs(tffs);
      setPackages(pkgs);
      setContracts(ctcs);
    } catch (error) {
      setStatusMessage(error.message || "Unable to load hospital details.");
    }
  };

  const handleAddHospital = async (evt) => {
    evt.preventDefault();
    try {
      await apiPost("/api/hospitals/add", hospitalForm);
      setHospitalForm({
        name: "",
        address: "",
        city: "",
        state: "",
        tier: "TIER_1",
        networkType: "NON_NETWORK",
        standardRoomRentLimit: "",
        premiumRoomRentLimit: "",
      });
      setStatusMessage("Hospital registered successfully.");
      loadHospitals();
    } catch (error) {
      setStatusMessage(error.message || "Failed to register hospital.");
    }
  };

  const handleMapPlan = async (evt) => {
    evt.preventDefault();
    try {
      await apiPost("/api/hospitals/map-plan", {
        hospitalId: mappingForm.hospitalId,
        productId: mappingForm.productId,
        isCashless: mappingForm.isCashless,
      });
      setStatusMessage("Plan mapped to hospital successfully.");
      refreshHospitalDetails(mappingForm.hospitalId);
    } catch (error) {
      setStatusMessage(error.message || "Failed to map plan.");
    }
  };

  const handleDefineTariff = async (evt) => {
    evt.preventDefault();
    try {
      await apiPost("/api/hospitals/tariffs", {
        hospitalId: tariffForm.hospitalId,
        procedureName: tariffForm.procedureName,
        maxCoverage: tariffForm.maxCoverage,
        effectiveDate: tariffForm.effectiveDate,
      });
      setTariffForm((prev) => ({ ...prev, procedureName: "", maxCoverage: "", effectiveDate: "" }));
      setStatusMessage("Tariff defined successfully.");
      refreshHospitalDetails(tariffForm.hospitalId);
    } catch (error) {
      setStatusMessage(error.message || "Failed to define tariff.");
    }
  };

  const handleCreatePackage = async (evt) => {
    evt.preventDefault();
    try {
      await addHospitalPackage(packageForm);
      setPackageForm((prev) => ({ ...prev, packageCode: "", procedureName: "", packageRate: "", effectiveDate: "", currency: "INR" }));
      setStatusMessage("Hospital package saved successfully.");
      refreshHospitalDetails(packageForm.hospitalId);
    } catch (error) {
      setStatusMessage(error.message || "Failed to save hospital package.");
    }
  };

  const handleCreateContract = async (evt) => {
    evt.preventDefault();
    try {
      await addHospitalContract(contractForm);
      setContractForm((prev) => ({ ...prev, contractName: "", contractVersion: "", contractFileKey: "", startDate: "", endDate: "", status: "ACTIVE" }));
      setStatusMessage("Hospital contract registered successfully.");
      refreshHospitalDetails(contractForm.hospitalId);
    } catch (error) {
      setStatusMessage(error.message || "Failed to register contract.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hospital management</h1>
            <p className="mt-1 text-sm text-slate-500">Register hospitals, map plans for cashless eligibility, and define procedure tariffs.</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm border border-slate-200">
            {statusMessage || "Ready to manage hospital network."}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <section className="card-premium p-6">
              <h2 className="text-xl font-bold text-slate-900">Add a hospital</h2>
              <form onSubmit={handleAddHospital} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-700">
                    Hospital name
                    <input
                      value={hospitalForm.name}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                      className="input-premium mt-2"
                      required
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    City
                    <input
                      value={hospitalForm.city}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, city: e.target.value })}
                      className="input-premium mt-2"
                      required
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-700">
                    State
                    <input
                      value={hospitalForm.state}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, state: e.target.value })}
                      className="input-premium mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    Tier
                    <select
                      value={hospitalForm.tier}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, tier: e.target.value })}
                      className="input-premium mt-2"
                    >
                      {tiers.map((tier) => (
                        <option key={tier} value={tier}>{tier}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-700">
                    Network type
                    <select
                      value={hospitalForm.networkType}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, networkType: e.target.value })}
                      className="input-premium mt-2"
                    >
                      {networkTypes.map((type) => (
                        <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm text-slate-700">
                    Standard room rent cap (₹)
                    <input
                      type="number"
                      min="0"
                      value={hospitalForm.standardRoomRentLimit}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, standardRoomRentLimit: e.target.value })}
                      className="input-premium mt-2"
                      placeholder="e.g. 2000"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-700">
                    Premium room rent cap (₹)
                    <input
                      type="number"
                      min="0"
                      value={hospitalForm.premiumRoomRentLimit}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, premiumRoomRentLimit: e.target.value })}
                      className="input-premium mt-2"
                      placeholder="e.g. 4000"
                    />
                  </label>
                </div>
                <label className="block text-sm text-slate-700">
                  Address
                  <textarea
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                    className="input-premium mt-2 min-h-[96px]"
                  />
                </label>
                <button type="submit" className="btn-primary">Register hospital</button>
              </form>
            </section>

            <section className="card-premium p-6">
              <h2 className="text-xl font-bold text-slate-900">Map plan to hospital</h2>
              <form onSubmit={handleMapPlan} className="mt-6 space-y-4">
                <label className="block text-sm text-slate-700">
                  Hospital
                  <select
                    value={mappingForm.hospitalId}
                    onChange={(e) => {
                      setMappingForm({ ...mappingForm, hospitalId: e.target.value });
                      refreshHospitalDetails(e.target.value);
                    }}
                    className="input-premium mt-2"
                    required
                  >
                    <option value="">Select a hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>{hospital.name} — {hospital.city}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-slate-700">
                  Plan / product ID
                  <input
                    value={mappingForm.productId}
                    onChange={(e) => setMappingForm({ ...mappingForm, productId: e.target.value })}
                    className="input-premium mt-2"
                    required
                    placeholder="Numeric product ID"
                  />
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={mappingForm.isCashless}
                    onChange={(e) => setMappingForm({ ...mappingForm, isCashless: e.target.checked })}
                  />
                  Cashless enabled for this plan
                </label>
                <button type="submit" className="btn-primary">Map plan</button>
              </form>
            </section>

            <section className="card-premium p-6">
              <h2 className="text-xl font-bold text-slate-900">Define hospital tariff</h2>
              <form onSubmit={handleDefineTariff} className="mt-6 space-y-4">
                <label className="block text-sm text-slate-700">
                  Hospital
                  <select
                    value={tariffForm.hospitalId}
                    onChange={(e) => setTariffForm({ ...tariffForm, hospitalId: e.target.value })}
                    className="input-premium mt-2"
                    required
                  >
                    <option value="">Select a hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>{hospital.name} — {hospital.city}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-slate-700">
                  Procedure name
                  <input
                    value={tariffForm.procedureName}
                    onChange={(e) => setTariffForm({ ...tariffForm, procedureName: e.target.value })}
                    className="input-premium mt-2"
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-700">
                    Max coverage (INR)
                    <input
                      value={tariffForm.maxCoverage}
                      onChange={(e) => setTariffForm({ ...tariffForm, maxCoverage: e.target.value })}
                      className="input-premium mt-2"
                      required
                      type="number"
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    Effective date
                    <input
                      type="date"
                      value={tariffForm.effectiveDate}
                      onChange={(e) => setTariffForm({ ...tariffForm, effectiveDate: e.target.value })}
                      className="input-premium mt-2"
                    />
                  </label>
                </div>
                <button type="submit" className="btn-primary">Save tariff</button>
              </form>
            </section>

            <section className="card-premium p-6">
              <h2 className="text-xl font-bold text-slate-900">Create hospital package</h2>
              <form onSubmit={handleCreatePackage} className="mt-6 space-y-4">
                <label className="block text-sm text-slate-700">
                  Hospital
                  <select
                    value={packageForm.hospitalId}
                    onChange={(e) => setPackageForm({ ...packageForm, hospitalId: e.target.value })}
                    className="input-premium mt-2"
                    required
                  >
                    <option value="">Select a hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>{hospital.name} — {hospital.city}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-slate-700">
                  Package code
                  <input
                    value={packageForm.packageCode}
                    onChange={(e) => setPackageForm({ ...packageForm, packageCode: e.target.value })}
                    className="input-premium mt-2"
                    placeholder="Optional"
                  />
                </label>
                <label className="block text-sm text-slate-700">
                  Procedure name
                  <input
                    value={packageForm.procedureName}
                    onChange={(e) => setPackageForm({ ...packageForm, procedureName: e.target.value })}
                    className="input-premium mt-2"
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-700">
                    Package rate (INR)
                    <input
                      type="number"
                      min="0"
                      value={packageForm.packageRate}
                      onChange={(e) => setPackageForm({ ...packageForm, packageRate: e.target.value })}
                      className="input-premium mt-2"
                      required
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    Currency
                    <input
                      value={packageForm.currency}
                      onChange={(e) => setPackageForm({ ...packageForm, currency: e.target.value })}
                      className="input-premium mt-2"
                    />
                  </label>
                </div>
                <label className="block text-sm text-slate-700">
                  Effective date
                  <input
                    type="date"
                    value={packageForm.effectiveDate}
                    onChange={(e) => setPackageForm({ ...packageForm, effectiveDate: e.target.value })}
                    className="input-premium mt-2"
                  />
                </label>
                <button type="submit" className="btn-primary">Save package</button>
              </form>
            </section>

            <section className="card-premium p-6">
              <h2 className="text-xl font-bold text-slate-900">Register hospital contract</h2>
              <form onSubmit={handleCreateContract} className="mt-6 space-y-4">
                <label className="block text-sm text-slate-700">
                  Hospital
                  <select
                    value={contractForm.hospitalId}
                    onChange={(e) => setContractForm({ ...contractForm, hospitalId: e.target.value })}
                    className="input-premium mt-2"
                    required
                  >
                    <option value="">Select a hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>{hospital.name} — {hospital.city}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-slate-700">
                  Contract name
                  <input
                    value={contractForm.contractName}
                    onChange={(e) => setContractForm({ ...contractForm, contractName: e.target.value })}
                    className="input-premium mt-2"
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-700">
                    Contract version
                    <input
                      value={contractForm.contractVersion}
                      onChange={(e) => setContractForm({ ...contractForm, contractVersion: e.target.value })}
                      className="input-premium mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    Contract file key
                    <input
                      value={contractForm.contractFileKey}
                      onChange={(e) => setContractForm({ ...contractForm, contractFileKey: e.target.value })}
                      className="input-premium mt-2"
                      placeholder="Document key or URL"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-700">
                    Start date
                    <input
                      type="date"
                      value={contractForm.startDate}
                      onChange={(e) => setContractForm({ ...contractForm, startDate: e.target.value })}
                      className="input-premium mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    End date
                    <input
                      type="date"
                      value={contractForm.endDate}
                      onChange={(e) => setContractForm({ ...contractForm, endDate: e.target.value })}
                      className="input-premium mt-2"
                    />
                  </label>
                </div>
                <label className="block text-sm text-slate-700">
                  Status
                  <select
                    value={contractForm.status}
                    onChange={(e) => setContractForm({ ...contractForm, status: e.target.value })}
                    className="input-premium mt-2"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="RENEWAL_DUE">RENEWAL_DUE</option>
                  </select>
                </label>
                <button type="submit" className="btn-primary">Register contract</button>
              </form>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="card-premium p-6">
              <h2 className="text-xl font-bold text-slate-900">Hospital directory</h2>
              <div className="mt-4 space-y-3">
                {hospitals.length === 0 && <p className="text-sm text-slate-500">No hospitals yet. Register one to begin.</p>}
                {hospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    type="button"
                    onClick={() => {
                      setSelectedHospitalId(hospital.id.toString());
                      setMappingForm((prev) => ({ ...prev, hospitalId: hospital.id.toString() }));
                      setTariffForm((prev) => ({ ...prev, hospitalId: hospital.id.toString() }));
                      refreshHospitalDetails(hospital.id);
                    }}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {hospital.name}
                    <span className="ml-2 text-slate-400">{hospital.city}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="card-premium p-6">
              <h2 className="text-xl font-bold text-slate-900">Selected hospital details</h2>
              {selectedHospitalId ? (
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">Plan mappings</p>
                  {mappings.length === 0 ? (
                    <p>No plan mappings defined yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {mappings.map((mapping) => (
                        <li key={mapping.id} className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                          Plan {mapping.productId} • {mapping.isCashless ? "Cashless" : "Reimbursement"}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="font-semibold text-slate-800">Tariffs</p>
                  {tariffs.length === 0 ? (
                    <p>No tariffs configured yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {tariffs.map((tariff) => (
                        <li key={tariff.id} className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                          {tariff.procedureName} • ₹{tariff.maxCoverage} • {tariff.effectiveDate}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="font-semibold text-slate-800">Packages</p>
                  {packages.length === 0 ? (
                    <p>No packages registered yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {packages.map((pkg) => (
                        <li key={pkg.id} className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                          {pkg.packageCode ? `${pkg.packageCode} - ` : ""}{pkg.procedureName} • ₹{pkg.packageRate} {pkg.currency} • {pkg.effectiveDate || "no date"}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="font-semibold text-slate-800">Contracts</p>
                  {contracts.length === 0 ? (
                    <p>No contracts registered yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {contracts.map((contract) => (
                        <li key={contract.id} className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                          {contract.contractName} • {contract.contractVersion || "vN/A"} • {contract.status}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Select a hospital to see mappings, tariffs, packages, and contracts.</p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
