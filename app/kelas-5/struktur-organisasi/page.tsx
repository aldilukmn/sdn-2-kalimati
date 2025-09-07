"use client"
import Link from "next/link";
import { OrganizationChart } from 'primereact/organizationchart';
import { useState } from 'react';

export default function StrukturOrganisasi() {
const [data] = useState([
        {
            expanded: true,
            type: 'person',
            className: 'bg-indigo-500 text-white',
            style: { borderRadius: '12px' },
            data: {
                image: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                name: 'Amy Elsner',
                title: 'CEO'
            },
            children: [
                {
                    expanded: true,
                    type: 'person',
                    className: 'bg-purple-500 text-white',
                    style: { borderRadius: '12px' },
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/annafali.png',
                        name: 'Anna Fali',
                        title: 'CMO'
                    },
                    children: [
                        {
                            label: 'Sales',
                            className: 'bg-purple-500 text-white',
                            style: { borderRadius: '12px' }
                        },
                        {
                            label: 'Marketing',
                            className: 'bg-purple-500 text-white',
                            style: { borderRadius: '12px' }
                        }
                    ]
                },
                {
                    expanded: true,
                    type: 'person',
                    className: 'bg-teal-500 text-white',
                    style: { borderRadius: '12px' },
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/stephenshaw.png',
                        name: 'Stephen Shaw',
                        title: 'CTO'
                    },
                    children: [
                        {
                            label: 'Development',
                            className: 'bg-teal-500 text-white',
                            style: { borderRadius: '12px' }
                        },
                        {
                            label: 'UI/UX Design',
                            className: 'bg-teal-500 text-white',
                            style: { borderRadius: '12px' }
                        }
                    ]
                }
            ]
        }
    ]);

  const nodeTemplate = (node:any) => {
        if (node.type === 'person') {
          return (
              <div className={`flex flex-col items-center p-3 shadow-md ${node.className || ""}`} style={node.style}>
                <img alt={node.data.name} src={node.data.image} className="mb-3 w-20" />
                <span className="font-bold mb-2">{node.data.name}</span>
                <span>{node.data.title}</span>
              </div>
            );
        }

        return node.label;
    };
  
  return (
    <div className="flex flex-col md:mx-20 mx-5 min-h-screen">
      <div className="flex w-full my-10 items-center justify-between gap-10">
        <Link
          href="/kelas-5"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm md:text-base"
        >
          <span className="font-semibold">&lt;</span> Kembali
        </Link>
        <div className="flex-1 flex justify-center">
          <h2 className="md:w-fit w-full lg:text-2xl md:text-xl font-semibold tracking-wide shadow-md bg-white py-2 md:py-3 px-5 rounded-lg text-center">
            Struktur Organisasi di Kelas 5
          </h2>
        </div>
      </div>
      <div className="card overflow-x-auto">
            <OrganizationChart value={data} nodeTemplate={nodeTemplate} />
      </div>
    </div>
  );
}