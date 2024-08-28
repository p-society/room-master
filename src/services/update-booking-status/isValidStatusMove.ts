import BookingStatus from '../../constants/booking-status.enum';

const isValidRoomStatusMove = (currentStatus: string, newStatus: string): boolean => {
  // Define the valid status transitions
  const validTransitions: Record<string, string[]> = {
    [BookingStatus.PENDING]: [BookingStatus.APPROVED,BookingStatus.CANCELLED],
    [BookingStatus.CANCELLED]: [],
    [BookingStatus.APPROVED]: [],
  };
  return validTransitions[currentStatus].includes(newStatus);
};

export default isValidRoomStatusMove;
