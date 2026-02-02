
import React, { useState, useEffect } from 'react';
import { TAMIL_NADU_COLLEGES, generateNextGatePassId, generateUniqueApplicationNo, calculateToDate } from '../constants';
import { InternshipApplication } from '../types';
import { 
  User, BookOpen, Briefcase, UserPlus, 
  CheckCircle, PlusCircle, FileText,
  Lock, ArrowRight, ShieldCheck, RefreshCcw
} from 'lucide-react';
import UndertakingForm from './UndertakingForm';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  name, 
  type = "text", 
  required = true, 
  placeholder = "", 
  options = [], 
  value, 
  onChange,
  readOnly = false
}) => (
  <div className="flex flex-col space-y-1">
    <label className="normal-text font-bold text-gray-700 text-sm flex items-center justify-between">
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
      {readOnly && <Lock size={12} className="text-gray-400" />}
    </label>
    {type === 'select' ? (
      <select 
        name={name} 
        value={value} 
        onChange={onChange}
        disabled={readOnly}
        className={`border border-gray-300 p-2 rounded focus:ring-1 focus:ring-ssp-blue focus:outline-none bg-white normal-text shadow-sm text-base ${readOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
        required={required}
      >
        <option value="">Select Option</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : type === 'textarea' ? (
      <textarea 
        name={name} 
        value={value} 
        onChange={onChange}
        readOnly={readOnly}
        className={`border border-gray-300 p-2 rounded focus:ring-1 focus:ring-ssp-blue focus:outline-none bg-white normal-text h-24 shadow-sm text-base ${readOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
        required={required}
        placeholder={placeholder}
      />
    ) : (
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange}
        readOnly={readOnly}
        className={`border border-gray-300 p-2 rounded focus:ring-1 focus:ring-ssp-blue focus:outline-none bg-white normal-text shadow-sm text-base ${readOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
        required={required}
        placeholder={placeholder}
      />
    )}
  </div>
);

interface StudentFormProps {
  onSubmit: (app: InternshipApplication) => void;
  existingApps?: InternshipApplication[];
  mode?: 'add' | 'edit';
  initialData?: Partial<InternshipApplication>;
}

const SectionHeader = ({ title, icon, isGrouped }: { title: string, icon: React.ReactNode, isGrouped?: boolean }) => (
  <div className="flex items-center justify-between border-b-2 border-ssp-blue pb-2 mb-6 mt-10 first:mt-0">
    <div className="flex items-center space-x-3">
      <div className="text-ssp-blue">{icon}</div>
      <h3 className="heading-text text-ssp-blue">{title}</h3>
    </div>
    {isGrouped && (
      <div className="flex items-center space-x-2 bg-blue-50 text-ssp-blue px-3 py-1 rounded-full border border-blue-100">
        <Lock size={12} />
        <span className="text-[10px] font-black uppercase tracking-wider">Group Linked - Read Only</span>
      </div>
    )}
  </div>
);

const StudentForm: React.FC<StudentFormProps> = ({ 
  onSubmit, 
  existingApps = [],
  mode = 'add',
  initialData
}) => {
  const [page, setPage] = useState(1); // 1: Main Form, 2: Undertaking
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const courseOptions = ['Engineering', 'Post Graduate', 'Faculty Members', 'Graduate', 'Diploma', 'Other'];
  const categoryOptions = ['UR', 'SC[25% DISCOUNT]', 'ST[25% DISCOUNT]', 'EMPLOYEE WARD[FULL FREE]', 'EMPLOYEE SON/DAUGHTER[50% DISCOUNT]', 'CISF[FULL FREE]'];

  const getInitialState = (groupId?: string | null): Partial<InternshipApplication> => ({
    id: '', 
    applicationNo: '',
    groupId: groupId || '',
    studentName: '',
    age: '',
    dob: '',
    identificationMark: '',
    course: '',
    specialization: '',
    collegeName: '',
    days: 0,
    fromDate: '',
    toDate: '',
    deptIPT: '',
    trainingType: 'Internship',
    passNo: '',
    gender: 'Male',
    fatherName: '',
    year: '',
    mobileNo: '',
    emergencyNo: '',
    collegeAddress: '',
    residentialAddress: '',
    status: 'Pending',
    spnoEmployee: '',
    category: '',
    signatureByName: '',
    iomTraining: 'IOM to respective dept',
    referralNo: '',
    referralDesignation: '',
    referralDepartment: '',
    referralPersonContact: '',
    createdAt: new Date().toISOString(),
  });

  const [formData, setFormData] = useState<Partial<InternshipApplication>>(initialData || getInitialState());
  const [collegeSearch, setCollegeSearch] = useState(initialData?.collegeName || '');
  const [isOtherCollege, setIsOtherCollege] = useState(initialData?.collegeName ? !TAMIL_NADU_COLLEGES.includes(initialData.collegeName) : false);
  const [showColleges, setShowColleges] = useState(false);

  // Initialize IDs for NEW applications
  useEffect(() => {
    if (mode === 'add' && !formData.id) {
      const nextId = generateNextGatePassId(existingApps.map(a => a.id));
      const nextAppNo = generateUniqueApplicationNo(existingApps.map(a => a.applicationNo));
      
      // If adding a student to an existing group, we keep the groupId and shared details
      const gId = activeGroupId || (Math.random().toString(36).substring(2, 9).toUpperCase());
      
      setFormData(prev => ({ 
        ...prev, 
        id: nextId, 
        applicationNo: nextAppNo,
        groupId: gId
      }));
    }
  }, [existingApps, activeGroupId, mode]);

  // Handle automatic date calculation
  useEffect(() => {
    if (formData.fromDate && formData.days !== undefined) {
      const toDate = calculateToDate(formData.fromDate, Number(formData.days));
      setFormData(prev => ({ ...prev, toDate }));
    }
  }, [formData.fromDate, formData.days]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const validateForm = () => {
    if (!formData.studentName || !formData.age || !formData.mobileNo) return "Please fill required personal details.";
    if (parseInt(formData.age || '0') < 18) return "Age must be 18 or above.";
    if (formData.mobileNo === formData.emergencyNo) return "Mobile and Emergency numbers must be different.";
    if (!formData.collegeName || !formData.course) return "Please fill required educational details.";
    if (!formData.fromDate || !formData.days) return "Please specify training dates.";
    return null;
  };

  const handleNextPage = () => {
    const error = validateForm();
    if (error) return alert(error);
    setPage(2);
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = () => {
    // Validation for signatureByName removed since those visual fields are gone
    onSubmit(formData as InternshipApplication);
    setActiveGroupId(formData.groupId || null);
    setIsSuccess(true);
  };

  const resetForNewGroup = () => {
    setActiveGroupId(null);
    setFormData(getInitialState());
    setCollegeSearch('');
    setIsOtherCollege(false);
    setIsSuccess(false);
    setPage(1);
  };

  const addNewStudentToGroup = () => {
    const nextId = generateNextGatePassId(existingApps.map(a => a.id));
    const nextAppNo = generateUniqueApplicationNo(existingApps.map(a => a.applicationNo));
    
    // Clear individual details (Stage 1 & 2) but preserve group details (Stage 3 & 4)
    setFormData(prev => ({
      ...prev,
      id: nextId,
      applicationNo: nextAppNo,
      studentName: '',
      fatherName: '',
      age: '',
      dob: '',
      identificationMark: '',
      gender: 'Male',
      mobileNo: '',
      emergencyNo: '',
      residentialAddress: '',
      category: '',
      course: '',
      specialization: '',
      collegeName: '',
      year: '',
      collegeAddress: '',
      createdAt: new Date().toISOString(),
      // Stage 3 & 4 details remain as they are in 'prev'
    }));
    setCollegeSearch('');
    setIsOtherCollege(false);
    setIsSuccess(false);
    setPage(1);
  };

  // SUCCESS SCREEN
  if (isSuccess && mode === 'add') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn space-y-12 text-center">
        <div className="bg-green-100 text-green-600 p-10 rounded-full shadow-lg border-4 border-white">
          <CheckCircle size={80} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase text-ssp-blue tracking-tight">Application Recorded</h2>
          <p className="normal-text text-gray-500 font-bold italic text-lg">The student has been successfully registered under Group ID: <span className="text-ssp-blue underline">{activeGroupId}</span></p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-8 justify-center w-full max-w-2xl">
          <button 
            onClick={addNewStudentToGroup}
            className="flex-1 flex items-center justify-center space-x-4 bg-ssp-blue text-white px-10 py-5 rounded-2xl shadow-2xl hover:bg-black transition-all font-black uppercase text-sm tracking-widest group"
          >
            <UserPlus size={24} className="group-hover:scale-110 transition-transform" />
            <span>Add Another Student</span>
          </button>
          <button 
            onClick={resetForNewGroup}
            className="flex-1 flex items-center justify-center space-x-4 bg-white text-gray-700 border-2 border-gray-100 px-10 py-5 rounded-2xl shadow-md hover:bg-gray-50 transition-all font-black uppercase text-sm tracking-widest group"
          >
            <RefreshCcw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>New Group Entry</span>
          </button>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 max-w-xl">
          <p className="text-xs text-blue-800 font-bold uppercase tracking-wider">Note to Officer</p>
          <p className="text-sm text-blue-600 mt-2 font-medium">Use "Add Another Student" to register students from the same college with identical training and referral details.</p>
        </div>
      </div>
    );
  }

  // UNDERTAKING PAGE
  if (page === 2) {
    return (
      <div className="animate-fadeIn">
        <UndertakingForm 
          data={formData} 
          onBack={() => setPage(1)} 
          onSubmit={handleFinalSubmit} 
          onUpdate={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))} 
        />
      </div>
    );
  }

  // MAIN FORM PAGE (All 4 Stages)
  return (
    <div className="max-w-7xl mx-auto py-2">
      <div className="bg-white p-10 shadow-2xl rounded-3xl border border-gray-100">
        
        {/* STAGE 1 & 2: INDIVIDUAL DETAILS */}
        <div className="animate-fadeIn space-y-8">
          <SectionHeader title="Stage 1: Personal Details (Individual)" icon={<User size={24} />} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FormField label="Application No" name="applicationNo" value={formData.applicationNo} onChange={handleChange} readOnly={true} />
            <FormField label="Gate Pass ID" name="id" value={formData.id} onChange={handleChange} readOnly={true} />
            <FormField label="Student Name" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Full legal name" />
            <FormField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
              <FormField label="Gender" name="gender" type="select" options={['Male', 'Female', 'Other']} value={formData.gender} onChange={handleChange} />
            </div>
            <FormField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
            <FormField label="Identification Mark" name="identificationMark" value={formData.identificationMark} onChange={handleChange} />
            <FormField label="Mobile No" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
            <FormField label="Emergency No" name="emergencyNo" value={formData.emergencyNo} onChange={handleChange} />
            <FormField label="Category" name="category" type="select" options={categoryOptions} value={formData.category} onChange={handleChange} />
          </div>
          <FormField label="Residential Address" name="residentialAddress" type="textarea" value={formData.residentialAddress} onChange={handleChange} />
        </div>

        <div className="animate-fadeIn space-y-8 mt-12">
          <SectionHeader title="Stage 2: Educational Details (Individual)" icon={<BookOpen size={24} />} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-1 relative">
              <label className="normal-text font-bold text-gray-700 text-sm">College Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="text" 
                  value={collegeSearch}
                  onChange={(e) => {
                    setCollegeSearch(e.target.value);
                    setShowColleges(true);
                    if (isOtherCollege) setFormData(prev => ({ ...prev, collegeName: e.target.value }));
                  }}
                  onFocus={() => { if (!isOtherCollege) setShowColleges(true); }}
                  placeholder={isOtherCollege ? "Enter college name manually" : "Type to search Tamil Nadu colleges..."}
                  className={`w-full border border-gray-300 p-2 rounded focus:ring-1 focus:ring-ssp-blue focus:outline-none bg-white normal-text shadow-sm text-base ${isOtherCollege ? 'bg-blue-50 border-ssp-blue font-bold' : ''}`}
                  required
                />
                {!isOtherCollege && showColleges && (
                  <div className="absolute top-full left-0 right-0 bg-white border shadow-2xl z-50 max-h-60 overflow-y-auto mt-1 rounded-xl">
                    {TAMIL_NADU_COLLEGES.filter(c => c.toLowerCase().includes(collegeSearch.toLowerCase())).map(c => (
                      <div key={c} className="p-4 hover:bg-ssp-blue hover:text-white cursor-pointer normal-text border-b last:border-0 transition-colors text-sm" onClick={() => { setFormData(prev => ({ ...prev, collegeName: c })); setCollegeSearch(c); setShowColleges(false); }}>{c}</div>
                    ))}
                    <div className="p-4 bg-gray-50 hover:bg-black hover:text-white cursor-pointer font-black uppercase text-[10px] tracking-widest transition-colors flex items-center justify-between" onClick={() => { setIsOtherCollege(true); setFormData(prev => ({ ...prev, collegeName: '' })); setCollegeSearch(''); setShowColleges(false); }}>
                      <span>Manual Entry (Other College)</span>
                      <PlusCircle size={14} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <FormField label="Course" name="course" type="select" options={courseOptions} value={formData.course} onChange={handleChange} />
            <FormField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} />
            <FormField label="Year of Study" name="year" value={formData.year} onChange={handleChange} />
            <FormField label="College Address" name="collegeAddress" type="textarea" value={formData.collegeAddress} onChange={handleChange} />
          </div>
        </div>

        {/* STAGE 3 & 4: COMMON GROUP DETAILS (Read Only for existing groups) */}
        <div className="animate-fadeIn space-y-8 mt-12">
          <SectionHeader title="Stage 3: Training Details (Group Common)" icon={<Briefcase size={24} />} isGrouped={!!activeGroupId && mode === 'add'} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FormField label="Training Type" name="trainingType" type="select" options={['Internship', 'Project']} value={formData.trainingType} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
            <FormField label="Dept (IPT)" name="deptIPT" value={formData.deptIPT} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
            <FormField label="From Date" name="fromDate" type="date" value={formData.fromDate} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
            <FormField label="Duration (Days)" name="days" type="number" value={formData.days} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
            <FormField label="To Date" name="toDate" type="date" value={formData.toDate} onChange={handleChange} readOnly={true} />
            <FormField label="IOM Assignment" name="iomTraining" type="select" options={['IOM to AC CISF', 'IOM to safety dept', 'IOM to respective dept']} value={formData.iomTraining} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
          </div>
        </div>

        <div className="animate-fadeIn space-y-8 mt-12">
          <SectionHeader title="Stage 4: Referral Details (Group Common)" icon={<ShieldCheck size={24} />} isGrouped={!!activeGroupId && mode === 'add'} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FormField label="Referral No" name="referralNo" value={formData.referralNo} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
            <FormField label="Referral Designation" name="referralDesignation" value={formData.referralDesignation} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
            <FormField label="Referral Dept" name="referralDepartment" value={formData.referralDepartment} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
            <FormField label="Referral Contact" name="referralPersonContact" value={formData.referralPersonContact} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
            <FormField label="Pass No" name="passNo" value={formData.passNo} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
            <FormField label="SPNO Employee" name="spnoEmployee" value={formData.spnoEmployee} onChange={handleChange} readOnly={!!activeGroupId && mode === 'add'} />
          </div>
        </div>

        {/* FORM FOOTER NAVIGATION */}
        <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-gray-400">
             <ShieldCheck size={20} />
             <p className="text-xs font-bold uppercase tracking-widest italic">Authorized Salem Steel Plant Registration System</p>
          </div>
          <button 
            onClick={handleNextPage} 
            className="w-full md:w-auto flex items-center justify-center space-x-4 bg-ssp-blue text-white px-16 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-black transition-all group"
          >
            <span>Proceed to Undertaking</span>
            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
