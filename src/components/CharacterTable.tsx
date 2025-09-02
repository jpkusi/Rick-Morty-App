import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Character } from '../types/character';
import { Link } from '@tanstack/react-router';

interface CharacterTableProps {
  characters: Character[];
}

const columnHelper = createColumnHelper<Character>();

const columns = [
  columnHelper.accessor('image', {
    header: 'Avatar',
    cell: (info) => (
      <img
        src={info.getValue()}
        alt={info.row.original.name}
        className="w-12 h-12 rounded-full object-cover"
      />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => (
      <Link
        to="/character/$characterId"
        params={{ characterId: info.row.original.id.toString() }}
        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      const statusColors = {
        Alive: 'text-green-600 bg-green-100',
        Dead: 'text-red-600 bg-red-100',
        unknown: 'text-gray-600 bg-gray-100',
      };
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor('species', {
    header: 'Species',
  }),
  columnHelper.accessor('gender', {
    header: 'Gender',
  }),
  columnHelper.accessor('origin.name', {
    header: 'Origin',
    cell: (info) => (
      <span className="text-sm text-gray-600 max-w-32 truncate block">
        {info.getValue()}
      </span>
    ),
  }),
];

export const CharacterTable: React.FC<CharacterTableProps> = ({ characters }) => {
  const table = useReactTable({
    data: characters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};