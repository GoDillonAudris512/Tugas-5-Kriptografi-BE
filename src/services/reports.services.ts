import {BlobOptions} from 'buffer';
import {db} from '../database';
import {Report, Chat} from '../models';

const reportRepository = db.getRepository(Report);
const chatRepository = db.getRepository(Chat);

const getReports = async () => {
  try {
    const reports = await reportRepository.find();
    return reports;
  } catch (err) {
    throw new Error('Unable to get reports');
  }
};

const getReportById = async (id: number) => {
  const report = await reportRepository.findOneOrFail({
    where: {
      id: id,
    },
  });

  return report;
};

const createReport = async (
  chat_id: string,
  issuer_id: string,
  reason: string
) => {
  const issuedChat = await chatRepository.findOneOrFail({
    where: {
      chat_id: chat_id,
    },
  });

  const issuedUserId =
    issuedChat.user_id1 === issuer_id
      ? issuedChat.user_id2
      : issuedChat.user_id1;

  const newReport = await reportRepository.save({
    chat_id: chat_id,
    issuer_id: issuer_id,
    issued_id: issuedUserId,
    reason: reason,
    seen: false,
  });

  return newReport;
};

const markReport = async (id: number, seen: boolean) => {
  const report = await reportRepository.save({
    id,
    seen,
  });

  return report;
};

const getReportsBySeen = async (seen: boolean) => {
  const reports = await reportRepository.find({
    where: {
      seen,
    },
  });

  return reports;
};

export default {
  getReports,
  getReportById,
  createReport,
  markReport,
  getReportsBySeen,
};
