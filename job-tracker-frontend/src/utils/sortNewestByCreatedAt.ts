type HasCreatedAt = {
  createdAt: string;
};

// long and hard to read
export const sortNewestByCreatedAt = (data1: HasCreatedAt, data2: HasCreatedAt): number => new Date(data1.createdAt) > new Date(data2.createdAt) ? -1 : 1;