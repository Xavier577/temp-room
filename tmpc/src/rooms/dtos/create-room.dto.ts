import { PartialInstantiable } from '../../shared/utils/partial-instantiable';

export class CreateRoomDto extends PartialInstantiable<CreateRoomDto> {
  name: string;
  description?: string;
}
