import React, { useState, useRef, useEffect } from 'react';
import classes from './ListView.module.css';
import { FilterIcon, LeftArrow, searchMonthIcon, arrowLeftIcon, arrowRightIcon, FilterArrowIcon, xIcon } from 'src/icons/icons';
import { Link } from 'react-router-dom';
import { getAllShedules } from 'src/auth/api/requests';
import SubListView from './SubListView';
import moment from 'moment';

interface Schedule {
  user: any;
  id: string;
  createdAt: string; 
  updatedAt: string; 
  deletedAt: string | null;
  title: string;
  date: string; 
  startTime: string;
  endTime: string;
  workHours: string;
  workedHours: string;
  overWorkHours: string;
  floor: string;
  status: string;
  color: string;
  checkStatus: number;
  userId: string;
  month?: string;
  department?: string;
  salary?: any;
  roleName?: string;
  checkinTime: string;
  checkoutTime: string;
}

const convertDecimalToTime = (decimal: number): string => {
  const hours = Math.floor(decimal);
  const minutes = Math.floor((decimal - hours) * 60);
  const seconds = Math.floor(((decimal - hours) * 60 - minutes) * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const ListView: React.FC = () => {
  const [headers] = useState([
    { label: 'Full Name', key: 'username' },
    { label: 'Department', key: 'department'},
    { label: 'Role', key: 'role' },
    { label: 'Month', key: 'month' },
    { label: (<>Worked Hours {FilterArrowIcon}<br/><small style={{margin: 0}}>HH:MM:SS</small></>), key: 'totalWorkHours' },
    { label: (<>Salary {FilterArrowIcon}</>), key: 'salary' },
  ]);

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortDirectionDept, setSortDirectionDept] = useState<'asc' | 'desc'>('asc');
  const [sortDirectionSalary, setSortDirectionSalary] = useState<'asc' | 'desc'>('asc');
  const [sortDirectionHours, setSortDirectionHours] = useState<'asc' | 'desc'>('asc');
  const [sortDirectionRole, setSortDirectionRole] = useState<'asc' | 'desc'>('asc');
  const [clients, setClients] = useState<Schedule[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSubListViewOpen, setIsSubListViewOpen] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);
  const departmentDropdownRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [searchTerm, setSearchTerm] = useState<string>('');

  const months = {
    'January': 'January',
    'February': 'February',
    'March': 'March',
    'April': 'April',
    'May': 'May',
    'June': 'June',
    'July': 'July',
    'August': 'August',
    'September': 'September',
    'October': 'October',
    'November': 'November',
    'December': 'December',
    'All': 'All'
  };

  const departments = [...new Set(clients.map(client => client.user.department))].filter(Boolean);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getAllShedules();
        if (!response) {
          console.error('No response from getAllShedules');
          setClients([]);
          return;
        }

        const data = response?.data;
        if (!data || !Array.isArray(data)) {
          console.error('Invalid data format:', data);
          setClients([]);
          return;
        }
        
        const processedData = data
          .filter(client => client && client.date)
          .map(client => ({
            ...client,
            month: new Date(client.date).toLocaleString('en-US', { month: 'long' })
          }));
        setClients(processedData);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([]);
      }
    };

    fetchClients();
  }, []);

  const handleSortByName = () => {
    const sortedClients = [...clients].sort((a, b) => {
      return sortDirection === 'asc'
        ? a.user.username.localeCompare(b.user.username)
        : b.user.username.localeCompare(a.user.username);
    });
    setClients(sortedClients);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByDepartment = () => {
    const sortedClients = [...clients].sort((a, b) => {
      return sortDirectionDept === 'asc'
        ? (a.user.department || '').localeCompare(b.user.department || '')
        : (b.user.department || '').localeCompare(a.user.department || '');
    });
    setClients(sortedClients);
    setSortDirectionDept(sortDirectionDept === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByHours = () => {
    console.log('Before sort - Direction:', sortDirectionHours);
    
    // Сортируем renderedClients вместо clients
    const sortedData = [...renderedClients].sort((a, b) => {
      const hoursA = a.workedHours || 0;
      const hoursB = b.workedHours || 0;
      if (sortDirectionHours === 'asc') {
        return hoursB - hoursA; // От большего к меньшему
      }
      return hoursA - hoursB; // От меньшего к большему
    });
    
    // Обновляем состояние на основе отсортированных данных
    const newClients = [...clients].sort((a, b) => {
      const userA = sortedData.findIndex(item => item.user.id === a.userId);
      const userB = sortedData.findIndex(item => item.user.id === b.userId);
      return userA - userB;
    });
    
    setClients(newClients as Schedule[]);
    setSortDirectionHours(sortDirectionHours === 'asc' ? 'desc' : 'asc');

    console.log('After sort - Direction:', sortDirectionHours);
  };

  const handleSortBySalary = () => {
    console.log('Before sort - Direction:', sortDirectionSalary);
    
    // Сортируем renderedClients вместо clients
    const sortedData = [...renderedClients].sort((a, b) => {
      const salaryA = parseFloat(a.calculatedSalary || '0');
      const salaryB = parseFloat(b.calculatedSalary || '0');
      if (sortDirectionSalary === 'asc') {
        return salaryB - salaryA; // От большего к меньшему
      }
      return salaryA - salaryB; // От меньшего к большему
    });
    
    // Обновляем состояние на основе отсортированных данных
    const newClients = [...clients].sort((a, b) => {
      const userA = sortedData.findIndex(item => item.user.id === a.userId);
      const userB = sortedData.findIndex(item => item.user.id === b.userId);
      return userA - userB;
    });
    
    setClients(newClients as Schedule[]);
    setSortDirectionSalary(sortDirectionSalary === 'asc' ? 'desc' : 'asc');

    console.log('After sort - Direction:', sortDirectionSalary);
  };

  const handleSortByRole = () => {
    const sortedClients = [...clients].sort((a, b) => {
      const roleA = (a.user.role?.toUpperCase() === 'GENERAL' && a.user.roleName 
        ? a.user.roleName 
        : a.user.role) || '';
      const roleB = (b.user.role?.toUpperCase() === 'GENERAL' && b.user.roleName 
        ? b.user.roleName 
        : b.user.role) || '';
      return sortDirectionRole === 'asc'
        ? roleA.localeCompare(roleB)
        : roleB.localeCompare(roleA);
    });
    setClients(sortedClients);
    setSortDirectionRole(sortDirectionRole === 'asc' ? 'desc' : 'asc');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month === 'All' ? '' : month);
    setIsDropdownOpen(false);
  };

  const calculateTotalDepartmentSalary = () => {
    if (!selectedDepartment) return '0.00';
    
    return renderedClients
      .filter(client => client.user.department === selectedDepartment)
      .reduce((total, client) => total + parseFloat(client.calculatedSalary), 0)
      .toFixed(2);
  };

  const calculateTotalDepartmentHours = () => {
    if (!selectedDepartment) return '00:00:00';
    
    const totalHours = renderedClients
      .filter(client => client.user.department === selectedDepartment)
      .reduce((total, client) => total + client.workedHours, 0);
    
    return convertDecimalToTime(totalHours);
  };

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department === 'Select Department' ? '' : department);
    setIsDepartmentDropdownOpen(false);
  };

  const clearDepartmentSelection = () => {
    setSelectedDepartment('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(event.target as Node)) {
        setIsDepartmentDropdownOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, departmentDropdownRef]);

  const groupedClients = clients.reduce((acc, client) => {
    const userId = client.userId;
    const month = client.month || '';
    const day = new Date(client.date).getDate().toString();

    if (!acc[userId]) {
      acc[userId] = {
        user: client.user,
        workHoursByMonth: {},
        workHoursByDay: {},
      };
    }

    if (client.checkStatus === 2) {
      const workedHoursValue = parseFloat(client.workedHours) || 0;

      if (!acc[userId].workHoursByMonth[month]) {
        acc[userId].workHoursByMonth[month] = 0;
      }
      if (!acc[userId].workHoursByDay[month]) {
        acc[userId].workHoursByDay[month] = {};
      }

      acc[userId].workHoursByMonth[month] += workedHoursValue;
      acc[userId].workHoursByDay[month][day] = workedHoursValue;
    }

    return acc;
  }, {} as Record<string, { user: any; workHoursByMonth: Record<string, number>; workHoursByDay: Record<string, Record<string, number>> }>);

  const renderedClients = Object.values(groupedClients)
    .filter(client => {
      const matchesSearch = client.user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !selectedDepartment || client.user.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    })
    .map(client => {
      const workedHoursUntilNow = Object.entries(client.workHoursByMonth)
        .filter(([month, _]) => {
          const scheduleYear = clients
            .find(schedule => 
              schedule.userId === client.user.id && 
              schedule.month === month
            )?.date;
          
          const yearOfData = moment(scheduleYear).year();
          
          const shouldInclude = selectedMonth && selectedMonth !== 'All' 
            ? month === selectedMonth && yearOfData === currentDate.year()
            : yearOfData === currentDate.year();
          
          return shouldInclude;
        })
        .reduce((sum, [_, hours]) => sum + (hours || 0), 0);

      let calculatedSalary = "0.00";
      if (workedHoursUntilNow > 0) {
        if (client.user.salaryType === 'HOURLY') {
          calculatedSalary = (workedHoursUntilNow * parseFloat(client.user.salary || 0)).toFixed(2);
        } else {
          calculatedSalary = parseFloat(client.user.salary || 0).toFixed(2);
        }
      }

      return {
        ...client,
        workedHours: workedHoursUntilNow,
        calculatedSalary,
        selectedMonth: selectedMonth || 'All'
      };
    })
    .sort((a, b) => {
      if (sortDirectionHours === 'desc') {
        return b.workedHours - a.workedHours;
      }
      if (sortDirectionSalary === 'desc') {
        const salaryA = parseFloat(a.calculatedSalary || '0');
        const salaryB = parseFloat(b.calculatedSalary || '0');
        return salaryB - salaryA;
      }
      return 0;
    });

  const handleUserClick = (user: any) => {
    const userSchedules = clients
      .filter(client => client.userId === user.id)
      .map(schedule => ({
        date: schedule.date,
        checkinTime: schedule.checkinTime,
        checkoutTime: schedule.checkoutTime,
        workedHours: parseFloat(schedule.workedHours) || 0,
        workHours: parseFloat(schedule.workHours) || 0
      }));

    setSelectedUser({
      ...user,
      staffSchedules: userSchedules
    });
    setIsSubListViewOpen(true);
  };

  const closeSubListView = () => {
    setSelectedUser(null);
    setIsSubListViewOpen(false);
  };

  const datepicker = (
    <div className={classes.date_picker}>
      <div
        onClick={() => {
          const newDate = currentDate.clone().subtract(1, 'year');
          setCurrentDate(newDate);
        }}
        className={classes.DatePickerArrow}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        <span className={classes.yearLabel}>Year {currentDate.format("YYYY")}</span>
      </div>
      <div
        onClick={() => {
          const newDate = currentDate.clone().add(1, 'year');
          setCurrentDate(newDate);
        }}
        className={classes.DatePickerArrow}
      >
        {arrowRightIcon}
      </div>
    </div>
  );

  const clearAllFilters = async () => {
    // Очищаем только поиск и сортировку
    setSearchTerm('');
    setSortDirection('asc');
    setSortDirectionDept('asc');
    setSortDirectionSalary('asc');
    setSortDirectionHours('asc');
    setSortDirectionRole('asc');

    // Перезагрузка данных
    try {
      const response = await getAllShedules();
      if (response?.data) {
        const processedData = response.data
          .filter(client => client && client.date)
          .map(client => ({
            ...client,
            month: new Date(client.date).toLocaleString('en-US', { month: 'long' })
          }));
        setClients(processedData);
      }
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  return (
    <div className={classes.ListViewContainer}>
      <div className={classes.TableHead}>
        <div className={classes.ListViewHeadHeading}>
          <Link to="/staff">
            <button className={classes.ListViewHeadBackButton}>
              {LeftArrow}
            </button>
          </Link>
          <h1 className={classes.ListViewHeadText}>
            List View
          </h1>
          <div className={classes.HeaderRight}>
            <div className={classes.DepartmentSalaryContainer}>
              <div className={classes.DepartmentDropdownWrapper} ref={departmentDropdownRef}>
                <button 
                  className={classes.DepartmentDropdownButton}
                  onClick={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
                >
                  {selectedDepartment || 'Select Department'} {searchMonthIcon}
                  {selectedDepartment && (
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDepartmentSelection();
                      }}
                      style={{ 
                        marginLeft: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      ✕
                    </span>
                  )}
                </button>
                {isDepartmentDropdownOpen && (
                  <div className={classes.DepartmentDropdown}>
                    {departments.map(department => (
                      <div 
                        key={department} 
                        className={classes.DepartmentItem}
                        onClick={() => handleDepartmentSelect(department)}
                      >
                        {department}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {
                <div className={classes.TotalDepartmentSalary}>
                  Total Department Salary: {calculateTotalDepartmentSalary()}
                  <br />
                  Total Department Worked Hours: {calculateTotalDepartmentHours()}
                </div>
              }
            </div>
            {datepicker}
          </div>
        </div>
      </div>
      {isSubListViewOpen && selectedUser && (
        <SubListView 
          user={selectedUser} 
          onClose={closeSubListView}
          workHoursByMonth={groupedClients[selectedUser.id].workHoursByMonth}
          workHoursByDay={groupedClients[selectedUser.id].workHoursByDay}
        />
      )}
      <div className={classes.TableHead}>
        {headers.map(header => (
          <div
            key={header.key}
            className={`${
              header.key === 'username' ? classes.HeaderItemUserName :
              header.key === 'department' ? classes.HeaderItemDepartment :
              header.key === 'role' ? `${classes.HeaderItem} ${classes.HeaderItemRole}` :
              header.key === 'month' ? `${classes.HeaderItem} ${classes.HeaderItemMonth}` : 
              header.key === 'salary' ? `${classes.HeaderItem} ${classes.HeaderItemSalary}` :
              header.key === 'totalWorkHours' ? `${classes.HeaderItem} ${classes.HeaderItemHours}` :
              classes.HeaderItem
            }`}
            onClick={
              header.key === 'username' ? handleSortByName : 
              header.key === 'department' ? handleSortByDepartment :
              header.key === 'role' ? handleSortByRole :
              header.key === 'month' ? toggleDropdown :
              header.key === 'salary' ? handleSortBySalary :
              header.key === 'totalWorkHours' ? handleSortByHours :
              undefined
            }
          >
            {header.label}
            {header.key === 'username' && (
              <>
                <span className={classes.FilterIcon}>{FilterIcon}</span>
                <div className={classes.SearchContainer}>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={classes.SearchInput}
                  />
                </div>
              </>
            )}
            {header.key === 'department' && <span className={classes.FilterIcon}>{FilterIcon}</span>}
            {header.key === 'role' && <span className={classes.FilterIcon}>{FilterIcon}</span>}
            {header.key === 'month' && (
              <>
                {searchMonthIcon}
                {isDropdownOpen && (
                  <div ref={dropdownRef} className={classes.MonthDropdown}>
                    {Object.keys(months).map(month => (
                      <div key={month} onClick={() => handleMonthSelect(month)} className={classes.MonthItem}>
                        {months[month]}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        <div 
          className={classes.ClearIcon} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            clearAllFilters();
          }}
        >
          {xIcon}
        </div>
      </div>
      {renderedClients.map((client, index) => (
        <div key={index} className={classes.ClientRow}>
          <div className={classes.ClientUserName} onClick={() => handleUserClick(client.user)}>
            {client.user.username}
          </div>
          <div className={classes.ClientDepartment}>{client.user.department}</div> 
          <div className={classes.ClientRole}>
            {client.user.role?.toUpperCase() === 'GENERAL' && client.user.roleName 
              ? client.user.roleName 
              : client.user.role}
          </div>
          <div className={classes.ClientMonth}>{client.selectedMonth}</div>
          <div className={classes.ClientTotalWorkHours}>
            {typeof client.workedHours === 'number' ? convertDecimalToTime(client.workedHours) : '00:00:00'}
          </div>
          <div className={classes.ClientSalary}>
            {client.calculatedSalary || '0.00'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;
