
import React from 'react';
import { InternshipApplication } from '../types';

interface UndertakingFormProps {
  data: Partial<InternshipApplication>;
  onBack: () => void;
  onSubmit: () => void;
  onUpdate: (field: string, value: string) => void;
}

const UndertakingForm: React.FC<UndertakingFormProps> = ({ data, onBack, onSubmit, onUpdate }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 shadow-2xl border border-gray-100 font-serif leading-relaxed text-black">
      <h2 className="text-center font-bold text-2xl underline mb-10 tracking-widest uppercase">Letter of Undertaking</h2>

      <div className="mb-8 space-y-1">
        <p className="font-bold">To</p>
        <p className="font-bold">Steel Authority of India Limited</p>
        <p className="font-bold">Salem Steel Plant</p>
        <p className="font-bold">General Manager (HR & L&D)</p>
        <p className="font-bold">Human Resource Development Department</p>
        <p className="font-bold">Salem - 636 013, Tamilnadu</p>
      </div>

      <div className="space-y-8 text-lg">
        <div>
          <p className="text-justify">
            1. I, <span className="border-b border-black px-4 font-bold">{data.studentName?.toUpperCase() || '____________________'}</span> son / daughter of <span className="border-b border-black px-4 font-bold">{data.fatherName?.toUpperCase() || '____________________'}</span>, age <span className="border-b border-black px-4 font-bold">{data.age || '____'}</span> years, 
            Permanent address <span className="border-b border-black px-4 font-bold">{data.residentialAddress || '________________________________________'}</span>, am presently residing at <span className="border-b border-black px-4 font-bold">{data.residentialAddress || '________________________________________'}</span> and studying <span className="border-b border-black px-4 font-bold">{data.course || '__________'}</span> in <span className="border-b border-black px-4 font-bold">{data.collegeName || '____________________'}</span>.
          </p>
        </div>

        <div>
          <p className="text-justify">
            2. I have requested SAIL/SSP to allow me to undergo in-plant training/Internship / do a project work, based on letter No. 
            <input 
              type="text" 
              className="border-b border-black bg-transparent px-2 outline-none font-bold w-40 text-center" 
              placeholder="Letter No" 
              value={data.letterNo || ''} 
              onChange={(e) => onUpdate('letterNo', e.target.value)}
            /> dated 
            <input 
              type="date" 
              className="border-b border-black bg-transparent px-2 outline-none font-bold" 
              value={data.letterDate || ''} 
              onChange={(e) => onUpdate('letterDate', e.target.value)}
            /> from my college/institution and the same is recommended by the under mentioned "Introducer" and SAIL/SSP after considering the facts have been permitted me to do the in-plant training / Internship/ project Work.
          </p>
        </div>

        <div>
          <p className="text-justify">
            3. I hereby undertake and execute this agreement with SAIL/SSP for keeping enforcement during the training period including the following purposes:
          </p>
          <ul className="list-[lower-alpha] pl-10 space-y-2 mt-4 text-base italic">
            <li>I do hereby agree that I shall abide by the terms and conditions of permission and Rules and Regulations prevailing in SAIL/SSP.</li>
            <li>I shall also agree to follow up the other requirements stipulated by SAIL/SSP from time to time or other appropriate executive during training period.</li>
            <li>I shall not withdraw the permission given to me by the appropriate authority at any point of time and during the training period.</li>
            <li>The transport, boarding and lodging expenses incurred during the training period shall have to bear by me only.</li>
            <li>I shall rigidly follow up the Rules and Regulations of SAIL/SSP as well as the general Safety instructions given to me by appropriate authority.</li>
            <li>I shall carry out the assignment from 09:00 hrs to 13:00 hrs on all weekdays except Sunday / Company holidays.</li>
            <li>I shall not be entitled to any medical benefit / treatment in SAIL/SSP.</li>
            <li>I shall submit a copy of Report to SAIL/SSP after completing the training / projects.</li>
            <li>I shall be responsible for any loss, damage or injury caused to the company's property and employees of the company by any way either due to non-adherence of safety instructions and general guidelines or due to any commission, omission or negligence by me during the training period.</li>
            <li>Any paper publication and any special requirements related to SAIL/SSP will be done by me after getting the approval of the competent authority only.</li>
            <li>I shall be responsible for any loss, damage, accidents and injury whatsoever causes to me during training period and I will not claim for this by any way and if any claim made, the same is not tenable in any court.</li>
            <li>If I am found in non-assigned areas in the premises of SAIL/SSP, the permission granted shall be withdrawn by SAIL/SSP immediately without assigning any reason whatsoever.</li>
          </ul>
        </div>

        <div>
          <p className="text-justify">
            4. My "Introducer", as given details below, has also hereby undertake the safety and security of me during my in-plant training / internship / project work and also agreed with the above terms and conditions mentioned in this undertaking and execute this agreement with SAIL/SSP for keeping enforcement during the training period including the purpose mentioned (a) to (l) above.
          </p>
        </div>

        {/* Signature areas removed as per request */}
      </div>

      <div className="flex justify-between mt-16 no-print">
        <button onClick={onBack} className="bg-gray-200 text-black px-10 py-4 rounded font-bold uppercase hover:bg-black hover:text-white transition-all">Back to Application</button>
        <button onClick={onSubmit} className="bg-green-600 text-white px-16 py-4 rounded font-bold uppercase shadow-xl hover:bg-black transition-all">Final Submit Application</button>
      </div>
    </div>
  );
};

export default UndertakingForm;
