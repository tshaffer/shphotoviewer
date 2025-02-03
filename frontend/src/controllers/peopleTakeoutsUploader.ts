import { serverUrl, apiUrlFragment } from '../types';

export const uploadPeopleTakeouts = async (formData: FormData): Promise<any> => {
  
  const path = serverUrl + apiUrlFragment + 'uploadPeopleTakeouts';

  try {
    const response = await fetch(path, {
      method: 'POST',
      body: formData,
    });

    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
};
