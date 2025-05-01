const ScheduleModel = require("../../models/schedule")

const createSchedule = (agencyId, { platform, account, media, preview, title, folder, tags, type, price, fanPrice, scheduledAt }) =>
  ScheduleModel.create({
    owner: agencyId,
    platform,
    account,
    media,
    preview,
    title,
    folder,
    tags,
    type,
    price,
    fanPrice,
    scheduledAt,
  })

const loadSchedulesWithPage = ({ page, pageSize }) =>
  Promise.all([
    ScheduleModel
      .find()
      .sort("scheduledAt")
      .skip((parseInt(page) - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .populate("owner", "name")
      .populate({
        path: "account",
        select: "actor number alias",
        populate: {
          path: "actor",
          select: "name"
        }
      }),
    ScheduleModel.countDocuments()
  ]);

const ScheduleService2 = {
  createSchedule,
  loadSchedulesWithPage,
}

module.exports = ScheduleService2