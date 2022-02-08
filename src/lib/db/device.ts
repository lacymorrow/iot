/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';

import { generateRandom } from '../../utils/utils';
import clientPromise from '../mongodb';

export const addDevice = async (props: any) => {
  const client = await clientPromise;

  const device = await client
    .db(process.env.MONGODB_DB)
    .collection('devices')
    .insertOne({
      // createdByUser: '61e8717cd38d770f67357134',
      timeDate: String(new Date()),
      timeCreated: Date.now(),
      timeUpdated: Date.now(),
      ...props,
    });

  return device;
};

export const getAllDevicesPaginated = async ({
  limit,
  skip,
}: {
  limit: number;
  skip: number;
}) => {
  const client = await clientPromise;

  let devices = await client
    .db(process.env.MONGODB_DB)
    .collection('devices')
    .find({})
    .sort({ $natural: -1 })
    .skip(skip > 0 ? (skip - 1) * limit : 0)
    .limit(limit)
    .toArray();

  // Convert `new ObjectId('...')` to string '...'
  devices = devices.map((device: any) => {
    return { ...device, _id: device._id.toString() };
  });

  return devices;
};

export const getAllDevices = () =>
  getAllDevicesPaginated({ limit: 0, skip: 0 });

export const getFirstDevice = async () => {
  const client = await clientPromise;

  const device = await client
    .db(process.env.MONGODB_DB)
    .collection('devices')
    .findOne({}, { sort: { $natural: -1 } });

  // Convert `new ObjectId('...')` to string '...'
  return { ...device, _id: device._id.toString() };
};

export const getDevice = async (deviceId: string | string[]) => {
  // Return a single document with a given deviceId
  let id;
  const client = await clientPromise;

  try {
    if (!deviceId) {
      throw new Error('Invalid deviceId');
    }

    if (typeof deviceId === 'object') {
      [id] = deviceId;
    } else {
      id = deviceId;
    }

    const oId = new ObjectId(id);

    const device = await client
      .db(process.env.MONGODB_DB)
      .collection('devices')
      .findOne({ _id: oId });

    // Convert `new ObjectId('...')` to string '...'
    return { ...device, _id: device._id.toString() };
  } catch (error) {
    return null;
  }
};

export const getAllDeviceIds = async () => {
  const devices = await getAllDevices();
  const paths = devices.map((device: any) => {
    return device._id.toString();
  });

  return paths;
};

export const getRandomDeviceId = async () => {
  const ids = await getAllDeviceIds();

  return ids[generateRandom(ids.length)];
};

export const deleteDevice = async (deviceId: string | string[]) => {
  // Return a single document with a given deviceId
  let id;
  const client = await clientPromise;

  try {
    if (!deviceId) {
      throw new Error('Invalid deviceId');
    }

    if (typeof deviceId === 'object') {
      [id] = deviceId;
    } else {
      id = deviceId;
    }

    const oId = new ObjectId(id);

    await client
      .db(process.env.MONGODB_DB)
      .collection('devices')
      .remove({ _id: oId });

    return true;
  } catch (error) {
    return false;
  }
};

export const DeleteDevice = async (deviceId: string | string[]) => {
  // Return a single document with a given deviceId
  let id;
  const client = await clientPromise;

  try {
    if (!deviceId) {
      throw new Error('Invalid deviceId');
    }

    if (typeof deviceId === 'object') {
      [id] = deviceId;
    } else {
      id = deviceId;
    }

    const oId = new ObjectId(id);

    await client
      .db(process.env.MONGODB_DB)
      .collection('devices')
      .remove({ _id: oId });

    return true;
  } catch (error) {
    return false;
  }
};

export const deleteAllDevices = async () => {
  const client = await clientPromise;

  try {
    await client
      .db(process.env.MONGODB_DB)
      .collection('devices')
      .deleteMany({});

    return true;
  } catch (error) {
    return false;
  }
};