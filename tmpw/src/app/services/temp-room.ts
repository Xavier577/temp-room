import axios, { Axios } from 'axios';

const TempRoomHttpClient = axios.create({
  baseURL: 'http://localhost:9000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export type LoginPayload = {
  mode: string;
  username: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type CreateRoomPayload = {
  name: string;
  description: string;
};

export class TempRoom {
  constructor(private readonly httpClient: Axios) {}

  public async login<T = any>(payload: LoginPayload): Promise<T> {
    const res = await this.httpClient.post<T>('/auth/login', payload);

    return res.data;
  }

  public async signUp<T = any>(payload: SignupPayload): Promise<T> {
    const res = await this.httpClient.post<T>('/auth/signup', payload);

    return res.data;
  }

  public async fetchUserProfile<T = any>(accessToken: string): Promise<T> {
    const res = await this.httpClient.get<T>('/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  }

  public async createRoom<T = any>(
    accessToken: string,
    payload: CreateRoomPayload,
  ): Promise<T> {
    const res = await this.httpClient.post<T>('/room', payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  }

  public async fetchRoom<T = any>(
    accessToken: string,
    roomId: string,
  ): Promise<T> {
    const res = await this.httpClient.get<T>(`/room/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  }

  public async getRoomsUserIsIn<T = any>(accessToken: string): Promise<T> {
    const res = await this.httpClient.get<T>('/room/participating', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  }
}

const tempRoom = new TempRoom(TempRoomHttpClient);

export default tempRoom;
