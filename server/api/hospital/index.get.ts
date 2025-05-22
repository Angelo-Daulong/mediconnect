import { db } from '~/server/db/db';
import { hospital, room, doctor, hospitalUser } from '~/utils/schema';
import { eq, count, sql } from 'drizzle-orm';
import { concat } from 'drizzle-orm/pg-core/expressions';
export default defineEventHandler(async () => {
  const hospitals = await db.select().from(hospital);

  const availableRooms = await db
    .select({
      hospitalId: room.hospitalId,
      availableRooms: count(room.roomName),
    })
    .from(room)
    .where(eq(room.availability, true))
    .groupBy(room.hospitalId);

  const archivedHospital = await db
    .select({
      id: hospitalUser.id,
      deleted: hospitalUser.deleted,
    })
    .from(hospitalUser);

  const doctorsByHospital = await db
    .select({
      hospitalId: doctor.hospitalId,
      doctorNames: doctor.name,
      specilizations: doctor.services,
    })
    .from(doctor)
    .groupBy(doctor.hospitalId, doctor.name, doctor.services);

  // Create a lookup object for archived hospitals
  const archivedHospitalLookup = new Map(
    archivedHospital.map((h) => [h.id, h.deleted])
  );

  const hospitalsWithAvailableRooms = hospitals.map((hospital) => {
    // Check if the hospital is archived (deleted)
    const isArchived = archivedHospitalLookup.get(hospital.hospitalUserId);

    const matchingRooms = availableRooms.find(
      (roomData) => roomData.hospitalId === hospital.id
    );
    const matchingDoctors = doctorsByHospital.filter(
      (doctorData) => doctorData.hospitalId === hospital.id
    );

    const doctorNamesString =
      matchingDoctors.length > 0
        ? matchingDoctors.map((doctor) => doctor.doctorNames).join(', ')
        : ''; // Empty string if no doctors found

    const doctorSpecializations =
      matchingDoctors.length > 0
        ? matchingDoctors.map((doctor) => doctor.specilizations).join(', ')
        : '';

    return {
      ...hospital,
      availableRooms: matchingRooms?.availableRooms || 0,
      doctors: doctorNamesString,
      doctorSpecializations: doctorSpecializations,
      archived: isArchived || false, // Add archived status to the result
    };
  });

  return hospitalsWithAvailableRooms;
});
