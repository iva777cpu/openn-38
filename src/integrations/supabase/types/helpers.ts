import { Database } from './database';

type PublicSchema = Database['public'];

type TableName = keyof PublicSchema['Tables'];

export type Tables<T extends TableName> = {
  [K in T]: PublicSchema['Tables'][K] extends { Row: any }
    ? PublicSchema['Tables'][K]['Row']
    : never;
}[T];

export type TablesInsert<T extends TableName> = {
  [K in T]: PublicSchema['Tables'][K] extends { Insert: any }
    ? PublicSchema['Tables'][K]['Insert']
    : never;
}[T];

export type TablesUpdate<T extends TableName> = {
  [K in T]: PublicSchema['Tables'][K] extends { Update: any }
    ? PublicSchema['Tables'][K]['Update']
    : never;
}[T];