const ProxyModel = require("../../models/proxy")

const getAgencyProxyCount = (agencyId) =>
  ProxyModel.countDocuments({ owner: agencyId });

const appendAgencyProxies = (agencyId, proxies, deadline) =>
  ProxyModel.bulkWrite(proxies.map(proxy => ({
    insertOne: {
      document: {
        url: proxy,
        owner: agencyId,
        protocol: 'http',
        status: true,
        expiredAt: deadline,
      }
    }
  })));

const loadAgencyProxies = (agencyId) =>
  ProxyModel.find({ owner: agencyId }).populate('owner', 'name')

const clearAgencyProxies = (agencyId) =>
  ProxyModel.deleteMany({ owner: agencyId });

const clearProxies = () =>
  ProxyModel.deleteMany({});

const getCountStatsByAgency = () =>
  ProxyModel.aggregate([
    {
      $group: {
        _id: "$owner",
        count: { $sum: 1 }
      }
    }
  ]);

const getTotalStats = async () => {
  const now = new Date();
  return ProxyModel.aggregate([
    {
      $lookup: {
        from: "managers", // assuming the Manager collection is named "managers"
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails"
      }
    },
    {
      $unwind: {
        path: "$ownerDetails",
        preserveNullAndEmptyArrays: true // in case some proxies don't have owners
      }
    },
    {
      $group: {
        _id: "$owner", // group by agency
        agencyName: { $first: "$ownerDetails.name" },
        totalProxies: { $sum: 1 },
        disabledProxies: {
          $sum: {
            $cond: [{ $eq: ["$status", false] }, 1, 0]
          }
        },
        expiredProxies: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$status", false] }, // status is true
                  { $ifNull: ["$expiredAt", false] }, // expiredAt exists
                  { $lt: ["$expiredAt", now] } // expiredAt is before now
                ]
              },
              1,
              0
            ]
          }
        },
        validProxies: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$status", false] }, // status is true
                  {
                    $or: [
                      { $gt: ["$expiredAt", now] }, // expiredAt is after now + 3 days
                      { $eq: [{ $ifNull: ["$expiredAt", null] }, null] } // or expiredAt doesn't exist
                    ]
                  }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        agencyName: 1,
        totalProxies: 1,
        disabledProxies: 1,
        expiredProxies: 1,
        expiringProxies: 1,
        validProxies: 1,
      }
    },
    {
      $sort: {
        totalProxies: -1
      }
    }
  ]);
}

const changeProxiesStatus = (proxyIds, status) =>
  ProxyModel.updateMany({ _id: { $in: proxyIds } }, { $set: { status } });

const changeProxyStatus = (proxyId, status) =>
  ProxyModel.findByIdAndUpdate(proxyId, { $set: { status } });

const findProxyById = (proxyId) =>
  ProxyModel.findById(proxyId);

const resetProxyAccount = (proxyId, platform) => {
  const field = `usage.${platform}`;
  return ProxyModel.findByIdAndUpdate(proxyId, { $unset: { [field]: "" } });
}

const deleteProxy = (proxyId) =>
  ProxyModel.findByIdAndDelete(proxyId);

const deleteProxies = (proxyIds) =>
  ProxyModel.deleteMany({ _id: { $in: proxyIds } })

const getAgencyStats = (agencyId) =>
  Promise.all([
    ProxyModel.countDocuments({ owner: agencyId }),
    ProxyModel.countDocuments({ owner: agencyId, expiredAt: { $lt: new Date() } })
  ]);

const ProxyService2 = {
  loadAgencyProxies,
  clearAgencyProxies,
  appendAgencyProxies,
  getAgencyProxyCount,
  getAgencyStats,

  findProxyById,
  changeProxyStatus,
  changeProxiesStatus,
  deleteProxy,
  deleteProxies,
  clearProxies,

  resetProxyAccount,
  getCountStatsByAgency,
  getTotalStats,
}

module.exports = ProxyService2