enum RoomStatusEnum {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  CLEANING = 'cleaning',
  MAINTAINENCE = 'maintenance',
}

export const RoomStatusList = [
  RoomStatusEnum.AVAILABLE,
  RoomStatusEnum.OCCUPIED,
  RoomStatusEnum.CLEANING,
  RoomStatusEnum.MAINTAINENCE,
];

export default RoomStatusEnum;
