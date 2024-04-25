import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '../utils';

const patientApiQ = createApi({
  reducerPath: 'PatientApiQ',
  baseQuery: fetchBaseQuery(),
  tagTypes: ['Patients'],
  endpoints: (builder) => ({
    getPatientsList: builder.query<
      PatientsListResponse,
      {
        page: number;
        limit: number;
      }
    >({
      query: (params) => ({
        url: '/patient',
        params,
      }),
      providesTags: () => [{ type: 'Patients', id: 'LIST' }],
      transformResponse: (data: ApiResponse<PatientsListResponse>) => {
        return data?.data;
      },
    }),
  }),
});

export { patientApiQ };

export const { useGetPatientsListQuery } = patientApiQ;
