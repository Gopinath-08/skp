import { useState } from 'react';
import { studentService } from '../../services/api';

const stateDistricts = {
  'Andhra Pradesh': ['Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa', 'Other'],
  'Arunachal Pradesh': ['Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang', 'Other'],
  Assam: ['Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong', 'Other'],
  Bihar: ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran', 'Other'],
  Chhattisgarh: ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja', 'Other'],
  Goa: ['North Goa', 'South Goa', 'Other'],
  Gujarat: ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad', 'Other'],
  Haryana: ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar', 'Other'],
  'Himachal Pradesh': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una', 'Other'],
  'Jammu and Kashmir': ['Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur', 'Other'],
  Jharkhand: ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Saraikela Kharsawan', 'Simdega', 'West Singhbhum', 'Other'],
  Karnataka: ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir', 'Other'],
  Kerala: ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad', 'Other'],
  'Madhya Pradesh': ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha', 'Other'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Azamgarh', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bijnor', 'Bulandshahr', 'Deoria', 'Etawah', 'Faizabad', 'Farrukhabad', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hardoi', 'Jaunpur', 'Jhansi', 'Kanpur Nagar', 'Lucknow', 'Mathura', 'Meerut', 'Moradabad', 'Muzaffarnagar', 'Prayagraj', 'Raebareli', 'Saharanpur', 'Sitapur', 'Sultanpur', 'Varanasi', 'Other'],
  'West Bengal': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur', 'Other'],
  Delhi: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi', 'Other'],
  Maharashtra: ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Chandrapur', 'Dhule', 'Jalgaon', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nashik', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Solapur', 'Thane', 'Wardha', 'Other'],
  Manipur: ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul', 'Other'],
  Meghalaya: ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills', 'Other'],
  Mizoram: ['Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip', 'Other'],
  Nagaland: ['Chumoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu', 'Tuensang', 'Wokha', 'Zunheboto', 'Other'],
  Odisha: ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh', 'Other'],
  Punjab: ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'SAS Nagar', 'SBS Nagar', 'Tarn Taran', 'Other'],
  Rajasthan: ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur', 'Other'],
  Sikkim: ['Gangtok', 'Gyalshing', 'Mangan', 'Namchi', 'Pakyong', 'Soreng', 'Other'],
  'Tamil Nadu': ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanniyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar', 'Other'],
  Telangana: ['Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri', 'Other'],
  Tripura: ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura', 'Other'],
  Uttarakhand: ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi', 'Other'],
  Other: ['Other'],
};

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other'
];

const branches = [
  { name: 'Titilagarh', code: 'TLG' },
  { name: 'Khariar', code: 'KHR' },
];

const studentCategories = ['SC', 'ST', 'General', 'OBC'];

const normalizeBranch = (branchName) => {
  if (branchName === 'Balangir' || branchName === 'Titlagarh') return 'Titilagarh';
  if (branchName === 'Khariar Road') return 'Khariar';
  return branchName;
};

export default function StudentManager({ students, courses, batches, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('status');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [formData, setFormData] = useState({});

  const getCourseName = (student) => courses.find(c => c.id === student.courseId)?.name || student.Course?.name || student.courseId || '';
  const getRollPrefix = (branchName, admissionDate = new Date()) => {
    const normalizedBranch = normalizeBranch(branchName);
    const branch = branches.find((item) => item.name === normalizedBranch) || branches[0];
    const year = String(new Date(admissionDate || new Date()).getFullYear()).slice(-2);
    return `ICE${year}${branch.code}`;
  };
  const getBranchLabel = (branchName) => {
    const normalizedBranch = normalizeBranch(branchName);
    const branch = branches.find((item) => item.name === normalizedBranch);
    return branch ? `${branch.name} (${getRollPrefix(branch.name)})` : branchName || '-';
  };

  const filteredStudents = students.filter(s => {
    const matchSearch = (s.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
                        (s.admissionId || '').toLowerCase().includes(search.toLowerCase()) ||
                        (s.branch || '').toLowerCase().includes(search.toLowerCase());
    const matchCourse = filterCourse ? s.courseId == filterCourse : true;
    const matchStatus = filterStatus ? (s.status || 'Active') === filterStatus : true;
    return matchSearch && matchCourse && matchStatus;
  }).sort((a, b) => {
    const statusOrder = { Active: 1, Inactive: 2, Completed: 3 };
    const textCompare = (first, second) => String(first || '').localeCompare(String(second || ''));
    const getAdmissionNumber = (student) => Number(String(student.admissionId || '').replace(/\D/g, '')) || Number(student.id) || 0;
    const getAdmissionTime = (student) => {
      const dateValue = student.admissionDate || student.createdAt || student.updatedAt;
      const timestamp = dateValue ? new Date(dateValue).getTime() : NaN;
      return Number.isNaN(timestamp) ? getAdmissionNumber(student) : timestamp;
    };

    switch (sortBy) {
      case 'admissionIdAsc':
        return textCompare(a.admissionId, b.admissionId);
      case 'admissionIdDesc':
        return textCompare(b.admissionId, a.admissionId);
      case 'nameAsc':
        return textCompare(a.fullName, b.fullName);
      case 'nameDesc':
        return textCompare(b.fullName, a.fullName);
      case 'courseAsc':
        return textCompare(getCourseName(a), getCourseName(b));
      case 'dateNewest':
        return getAdmissionTime(b) - getAdmissionTime(a);
      case 'dateOldest':
        return getAdmissionTime(a) - getAdmissionTime(b);
      case 'status':
      default:
        return (statusOrder[a.status || 'Active'] || 4) - (statusOrder[b.status || 'Active'] || 4);
    }
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student permanently?')) return;
    try {
      await studentService.delete(id);
      onRefresh();
    } catch {
      alert('Error deleting student');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        branch: normalizeBranch(formData.branch) || 'Titilagarh',
      };
      
      if (formData.id) {
        await studentService.update(formData.id, payload);
      } else {
        await studentService.create(payload);
      }
      setModalOpen(false);
      onRefresh();
    } catch {
      alert('Error saving student');
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state,
      district: '',
    }));
  };

  const districtOptions = formData.state
    ? [...new Set([...(stateDistricts[formData.state] || ['Other']), formData.district].filter(Boolean))]
    : [];

  return (
    <div className="crud-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Student Management</h2>
        <div style={{display: 'flex', gap: '1rem'}}>
           <button className="btn btn-secondary" onClick={() => {
              const headers = ['Admission ID', 'Branch', 'Name', 'Father/Guardian', 'Mother', 'Student Phone', 'Parent Number', 'Category', 'Email', 'Address', 'District', 'State', 'PIN Code', 'Course', 'Batch', 'Status'];
              const fields = ['admissionId', 'branch', 'fullName', 'parentsName', 'motherName', 'mobile', 'parentNumber', 'studentCategory', 'email', 'address', 'district', 'state', 'pinCode', 'Course.name', 'Batch.name', 'status'];
              let csvContent = headers.join(',') + '\n';
              filteredStudents.forEach(r => {
                const values = fields.map(f => {
                  const v = f.split('.').reduce((o, i) => (o ? o[i] : null), r) || '';
                  return `"${String(v).replace(/"/g, '""')}"`;
                });
                csvContent += values.join(',') + '\n';
              });
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'students_export.csv';
              a.click();
           }}>Export Excel</button>
           <button className="btn btn-primary" onClick={() => { setFormData({}); setModalOpen(true); }}>+ Add Student</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Search by name or admission ID..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ maxWidth: '300px' }}
        />
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} style={{ maxWidth: '200px' }}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: '180px' }}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ maxWidth: '220px' }}>
          <option value="status">Sort: Status</option>
          <option value="admissionIdAsc">Sort: ID Low to High</option>
          <option value="admissionIdDesc">Sort: ID High to Low</option>
          <option value="nameAsc">Sort: Name A to Z</option>
          <option value="nameDesc">Sort: Name Z to A</option>
          <option value="courseAsc">Sort: Course A to Z</option>
          <option value="dateNewest">Sort: Newest Admission</option>
          <option value="dateOldest">Sort: Oldest Admission</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Branch</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Category</th>
              <th>Address</th>
              <th>Course</th>
              <th>Status</th>
              <th style={{textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td><strong>{student.admissionId}</strong></td>
                <td>{getBranchLabel(student.branch)}</td>
                <td>
                   <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>
                      {student.photo ? 'IMG' : 'N/A'}
                   </div>
                </td>
                <td>
                  <div>{student.fullName}</div>
                  <div style={{fontSize: '0.75rem', color: '#64748b'}}>Father/Guardian: {student.parentsName || '-'}</div>
                  <div style={{fontSize: '0.75rem', color: '#64748b'}}>Mother: {student.motherName || '-'}</div>
                </td>
                <td>
                  <div>{student.mobile}</div>
                  <div style={{fontSize: '0.75rem', color: '#64748b'}}>Parent: {student.parentNumber || '-'}</div>
                </td>
                <td>{student.studentCategory || '-'}</td>
                <td>
                  <div>{student.district || '-'}</div>
                  <div style={{fontSize: '0.75rem', color: '#64748b'}}>
                    {[student.state, student.pinCode].filter(Boolean).join(' - ') || '-'}
                  </div>
                </td>
                <td>{getCourseName(student)}</td>
                <td><span className={`status-badge ${student.status?.toLowerCase()}`}>{student.status || 'Active'}</span></td>
                <td style={{textAlign: 'right'}}>
                  <button className="btn btn-secondary btn-small" onClick={() => setViewStudent(student)} style={{marginRight: '0.5rem'}}>View</button>
                  <button className="btn btn-secondary btn-small" onClick={() => { setFormData(student); setModalOpen(true); }} style={{marginRight: '0.5rem'}}>Edit</button>
                  <button className="btn btn-secondary btn-small" onClick={() => handleDelete(student.id)} style={{color: '#ef4444', borderColor: '#fee2e2'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content" style={{maxWidth: '800px'}}>
            <button className="close" onClick={() => setModalOpen(false)}>×</button>
            <h2 style={{marginBottom: '1.5rem'}}>{formData.id ? 'Edit Student Profile' : 'Add New Student'}</h2>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Branch *</label>
                  <select name="branch" value={normalizeBranch(formData.branch) || 'Titilagarh'} onChange={(e) => setFormData({...formData, branch: e.target.value})} required disabled={Boolean(formData.id)}>
                    {branches.map((branch) => (
                      <option key={branch.name} value={branch.name}>{branch.name} - {getRollPrefix(branch.name, formData.admissionDate)}</option>
                    ))}
                  </select>
                </div>
                {!formData.id && (
                  <div className="form-group">
                    <label>Roll Number Prefix</label>
                    <input type="text" value={getRollPrefix(formData.branch || 'Titilagarh', formData.admissionDate)} readOnly />
                  </div>
                )}
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName || ''} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Father's Name *</label>
                  <input type="text" name="parentsName" value={formData.parentsName || ''} onChange={(e) => setFormData({...formData, parentsName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Mother Name *</label>
                  <input type="text" name="motherName" value={formData.motherName || ''} onChange={(e) => setFormData({...formData, motherName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" name="dob" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={(e) => setFormData({...formData, dob: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender || ''} onChange={(e) => setFormData({...formData, gender: e.target.value})} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact Number *</label>
                  <input type="text" name="mobile" value={formData.mobile || ''} onChange={(e) => setFormData({...formData, mobile: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Parent Number *</label>
                  <input type="text" name="parentNumber" value={formData.parentNumber || ''} onChange={(e) => setFormData({...formData, parentNumber: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" name="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Student Category *</label>
                  <select name="studentCategory" value={formData.studentCategory || ''} onChange={(e) => setFormData({...formData, studentCategory: e.target.value})} required>
                    <option value="">Select Category</option>
                    {studentCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Aadhaar Number *</label>
                  <input type="text" name="aadhaar" value={formData.aadhaar || ''} onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Qualification *</label>
                  <input type="text" name="qualification" value={formData.qualification || ''} onChange={(e) => setFormData({...formData, qualification: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Full Address *</label>
                  <textarea name="address" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Enter complete address" required />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <select name="state" value={formData.state || ''} onChange={handleStateChange} required>
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>District *</label>
                  <select name="district" value={formData.district || ''} onChange={(e) => setFormData({...formData, district: e.target.value})} required disabled={!formData.state}>
                    <option value="">{formData.state ? 'Select District' : 'Select State First'}</option>
                    {districtOptions.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>PIN Code *</label>
                  <input type="text" name="pinCode" value={formData.pinCode || ''} onChange={(e) => setFormData({...formData, pinCode: e.target.value.replace(/\D/g, '').slice(0, 6)})} placeholder="Enter 6 digit PIN code" inputMode="numeric" required />
                </div>
                <div className="form-group">
                  <label>Assign Course *</label>
                  <select name="courseId" value={formData.courseId || ''} onChange={(e) => setFormData({...formData, courseId: e.target.value})} required>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign Batch</label>
                  <select name="batchId" value={formData.batchId || ''} onChange={(e) => setFormData({...formData, batchId: e.target.value})}>
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name} - {b.timing}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status || 'Active'} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Admission Date</label>
                  <input type="date" name="admissionDate" value={formData.admissionDate ? formData.admissionDate.split('T')[0] : ''} onChange={(e) => setFormData({...formData, admissionDate: e.target.value})} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>
                <button type="submit" className="btn btn-primary">Save Student Details</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewStudent && (
        <div className="modal">
          <div className="modal-content" style={{maxWidth: '760px'}}>
            <button className="close" onClick={() => setViewStudent(null)}>Ã—</button>
            <h2 style={{marginBottom: '1.5rem'}}>Student Details</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
              <Detail label="Admission ID" value={viewStudent.admissionId} />
              <Detail label="Branch" value={getBranchLabel(viewStudent.branch)} />
              <Detail label="Status" value={viewStudent.status || 'Active'} />
              <Detail label="Full Name" value={viewStudent.fullName} />
              <Detail label="Student Category" value={viewStudent.studentCategory} />
              <Detail label="Father/Guardian Name" value={viewStudent.parentsName} />
              <Detail label="Mother Name" value={viewStudent.motherName} />
              <Detail label="Student Phone" value={viewStudent.mobile} />
              <Detail label="Parent Number" value={viewStudent.parentNumber} />
              <Detail label="Email" value={viewStudent.email} />
              <Detail label="Aadhaar" value={viewStudent.aadhaar} />
              <Detail label="Qualification" value={viewStudent.qualification} />
              <Detail label="Gender" value={viewStudent.gender} />
              <Detail label="Date of Birth" value={viewStudent.dob ? new Date(viewStudent.dob).toLocaleDateString() : ''} />
              <Detail label="Admission Date" value={viewStudent.admissionDate ? new Date(viewStudent.admissionDate).toLocaleDateString() : ''} />
              <Detail label="Course" value={getCourseName(viewStudent)} />
              <Detail label="Batch" value={batches.find(b => b.id === viewStudent.batchId)?.name || viewStudent.Batch?.name || viewStudent.batchId} />
              <div style={{gridColumn: '1 / -1'}}>
                <Detail label="Address" value={[
                  viewStudent.address,
                  viewStudent.district,
                  viewStudent.state,
                  viewStudent.pinCode,
                ].filter(Boolean).join(', ')} />
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>
              <button className="btn btn-primary" onClick={() => { setFormData(viewStudent); setViewStudent(null); setModalOpen(true); }}>Edit Student</button>
              <button className="btn btn-secondary" onClick={() => setViewStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem'}}>
      <div style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem'}}>
        {label}
      </div>
      <div style={{color: '#0f172a', fontWeight: 600}}>
        {value || '-'}
      </div>
    </div>
  );
}
