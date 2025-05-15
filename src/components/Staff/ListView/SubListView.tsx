import React, { useEffect, useRef, useState } from 'react';
import { DayPicker, DayProps, useDayRender, ClassNames } from 'react-day-picker';
import { format } from 'date-fns';
import moment from 'moment';
import classes from './SubListView.module.css';
import { arrowLeftIcon, arrowRightIcon, timeIcon, walletIcon, bonusIcon, spreadIcon, closeIcon } from 'src/icons/icons';
import OutsideClickHandler from "../components/OutsideClickHandler";

interface User {
  id: string;
  username: string;
  role: string;
  department?: string;
  salary: string;
  salaryType: string;
  roleName?: string;
  staffSchedules?: Array<{
    date: string;
    checkinTime?: string;
    checkoutTime?: string;
    workedHours?: number;
    workHours?: number;
    overWorkHours?: number;
    status?: string;
  }>;
}

interface SubListViewProps {
  user?: User;
  onClose: () => void;
  onBack?: (tab: string) => void;
  workHoursByMonth: Record<string, number>;
  workHoursByDay: Record<string, Record<string, number>>;
}

const monthsMapping = {
  'January': 'Ianuarie',
  'February': 'Februarie',
  'March': 'Martie',
  'April': 'Aprilie',
  'May': 'Mai',
  'June': 'Iunie',
  'July': 'Iulie',
  'August': 'August',
  'September': 'Septembrie',
  'October': 'Octombrie',
  'November': 'Noiembrie',
  'December': 'Decembrie'
};

const SubListView: React.FC<SubListViewProps> = ({ user, onClose, onBack, workHoursByMonth, workHoursByDay }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(currentDate.toDate());
  // const dropdownPortalRef = useRef<HTMLDivElement | null>(null);
  // const [activeDropdown, setActiveDropdown] = useState<Date | null>(null);
  const employeeBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentMonth(currentDate.toDate());
  }, [currentDate]);

  // Добавляем useEffect для отслеживания изменения selectedDay
  useEffect(() => {
    if (selectedDay && employeeBoxRef.current) {
      employeeBoxRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [selectedDay]);

  const subtractMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'M'));
  };

  const addMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'M'));
  };

  const datepicker = (
    <div className={classes.date_picker}>
      <div onClick={subtractMonth} className={classes.DatePickerArrow}>
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        {currentDate.format('MMMM, YYYY')}
      </div>
      <div onClick={addMonth} className={classes.DatePickerArrow}>
        {arrowRightIcon}
      </div>
    </div>
  );

  const classNames: ClassNames = {
    ...classes,
    caption: classes.caption,
    head: classes.head,
    tbody: classes.tbody,
    head_row: classes.HeadRow,
    row: classes.row,
    head_cell: classes.HeadCell,
    cell: classes.Cell,
    day: classes.Day,
    day_outside: classes.DayOutside,
  };

  const formatWeekdayName = (date: Date) => {
    return format(date, 'EEEE');
  };

  const getSelectedDayData = () => {
    if (!selectedDay) return { workedHours: 0, salary: 0 };
    
    const schedule = user?.staffSchedules?.find(s => 
      moment(s.date).format('YYYY-MM-DD') === moment(selectedDay).format('YYYY-MM-DD')
    );

    // Проверяем год
    const scheduleYear = schedule ? moment(schedule.date).year() : null;
    const selectedYear = moment(selectedDay).year();
    
    if (scheduleYear !== selectedYear) {
      return { workedHours: 0, salary: 0 };
    }

    const workedHours = schedule?.workedHours || 0;
    const monthKey = moment(selectedDay).format('MMMM');
    const totalMonthHours = workHoursByMonth[monthKey] || 0;
    
    const dailySalary = user?.salaryType === 'HOURLY'
      ? workedHours * parseFloat(user?.salary || "0")
      : totalMonthHours > 0 
        ? (workedHours / totalMonthHours) * parseFloat(user?.salary || "0")
        : 0;

    return { workedHours, salary: dailySalary };
  };

  // Получаем данные для текущего месяца с учетом года
  const currentMonthKey = currentDate.format('MMMM');
  const currentYear = currentDate.year();

  // Фильтруем часы только для текущего года
  const totalWorkHours = user?.staffSchedules
    ?.filter(schedule => moment(schedule.date).year() === currentYear && 
             moment(schedule.date).format('MMMM') === currentMonthKey)
    ?.reduce((total, schedule) => total + (schedule.workedHours || 0), 0) || 0;

  const formatTimeToHHMMSS = (hours: number): string => {
    if (!hours || isNaN(hours)) return "00:00:00";
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = 0;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timeToDisplay = (hours: number): string => {
    if (!hours || isNaN(hours)) return "0.00";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}.${String(m).padStart(2, '0')}`;
  };

  function Day(props: DayProps) {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const dayRender = useDayRender(props.date, props.displayMonth, buttonRef);
    const isSelected = selectedDay?.getTime() === props.date.getTime();
    
    const getDaySchedule = () => {
      if (!user?.staffSchedules) return null;
      
      const scheduleDate = moment(props.date).format('YYYY-MM-DD');
      
      const schedule = user.staffSchedules.find(s => 
        moment(s.date).format('YYYY-MM-DD') === scheduleDate
      );

      return schedule;
    };

    const formatTime = (timeString: string | undefined | null) => {
      if (!timeString) return '—';
      return new Date(timeString).toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
      });
    };

    const monthKey = moment(props.date).format('MMMM');
    const dayKey = props.date.getDate().toString();
    const schedule = getDaySchedule();
    
    // Получаем год из даты расписания, если оно есть
    const scheduleYear = schedule ? moment(schedule.date).year() : null;
    const currentYear = moment(props.date).year();
    
    // Проверяем, совпадает ли год расписания с текущим годом
    const matchesScheduleYear = scheduleYear === currentYear;
    
    const dayWorkedHours = matchesScheduleYear ? (schedule?.workedHours || 0) : 0;
    const dayWorkHours = matchesScheduleYear ? (workHoursByMonth[monthKey] || 0) : 0;

    if (dayWorkedHours > 0) {
      return (
        <button 
          ref={buttonRef} 
          {...dayRender.buttonProps}
          style={{
            padding: 0,
            position: 'relative',
            backgroundColor: isSelected ? 'rgba(255, 165, 0, 0.2)' : undefined,
          }}
          onClick={() => setSelectedDay(props.date)}
        >
          <div className={classes.CalendarDate}>
            <div className={classes.CalendarDateText} style={{ 
               position: 'relative',
               top: '8px',
               marginLeft: '17px'
            }}>
              {props.date.getDate()}
            </div>
          </div>
          <div className={classes.WorkingHours} style={{ marginBottom: '2px' }}>
            <span className={classes.HoursText}>
              {timeToDisplay(dayWorkedHours)} / {timeToDisplay(dayWorkHours)}
            </span>
          </div>
          <div className={classes.WorkingHours} style={{ marginBottom: '2px' }}>
            <span className={classes.HoursText}>
              In: {formatTime(schedule?.checkinTime)}
            </span>
          </div>
          <div className={classes.WorkingHours}>
            <span className={classes.HoursText}>
              Out: {formatTime(schedule?.checkoutTime)}
            </span>
          </div>
        </button>
      );
    }

    return (
      <button 
        ref={buttonRef} 
        {...dayRender.buttonProps}
        style={{
          backgroundColor: isSelected ? 'rgba(255, 165, 0, 0.2)' : undefined,
        }}
        onClick={() => setSelectedDay(props.date)}
      >
        <div className={classes.CalendarDate}>
          <div className={classes.CalendarDateText}>
            {props.date.getDate()}
          </div>
        </div>
      </button>
    );
  }

  const selectedDayData = getSelectedDayData();

  const handleCalendarBoxClick = (e: React.MouseEvent) => {
    // Проверяем, что клик был не по кнопке дня
    if (!(e.target as HTMLElement).closest('button')) {
    
    // Для отмены зброса даты при нажатии на ифно-карточки 
    // const target = e.target as HTMLElement;
    // Проверяем, что клик был не по кнопке дня и не по самим карточкам
    // if (!target.closest('button') && !target.closest(`.${classes.RowCard}`)) {
      setSelectedDay(null);
    }
  };

  // useEffect(() => {
  //   console.log('Props Data:', {
  //     workHoursByMonth,
  //     workHoursByDay,
  //     user
  //   });
  // }, [workHoursByMonth, workHoursByDay, user]);

  return (
    <>
      <div className={classes.Overlay} onClick={onClose} />
      <div 
        className={classes.CalendarBox} 
        ref={employeeBoxRef}
        onClick={handleCalendarBoxClick}
      >
        <OutsideClickHandler innerRef={employeeBoxRef} onClose={onClose} />
        {/* <div ref={dropdownPortalRef} style={{ position: 'relative' }} /> */}
        <div className={classes.CalendarHead}>
          <div className={classes.HeadTitle}>
            <span className={classes.EmployeeName}>Timetable</span>
            <span className={classes.EmployeeNamePoint}>·</span>
            <span className={classes.EmployeeName}>{user?.username}</span>
          </div>
          {datepicker}
          <button className={classes.CloseButton} onClick={onClose}>
            <span className={classes.CloseIcon}>{closeIcon}</span>
          </button>
        </div>

        <div className={classes.CalendarRow}>
          <div className={classes.RowCard} style={{ background: "rgba(18, 102, 79, 0.10)" }}>
            <div className={classes.CardIcon}>
              <div className={classes.IconContent}>{timeIcon}</div>
            </div>
            <div className={classes.CardContent}>
              <span className={classes.MainCardContent}>
                {formatTimeToHHMMSS(selectedDayData.workedHours)}
              </span>
              <div className={classes.SecondCardContent}>
                <span className={classes.SecondCardContentText}>
                  Worked hours for selected day {selectedDay ? <strong>({selectedDay.getDate()})</strong> : ''}
                </span>
              </div>
            </div>
          </div>

          <div className={classes.RowCard} style={{ background: "rgba(18, 102, 79, 0.10)" }}>
            <div className={classes.CardIcon}>
              <div className={classes.IconContent}>{timeIcon}</div>
            </div>
            <div className={classes.CardContent}>
              <span className={classes.MainCardContent}>
                {formatTimeToHHMMSS(totalWorkHours)}
              </span>
              <div className={classes.SecondCardContent}>
                <span className={classes.SecondCardContentText}>
                  Total work hours for month
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.CalendarRow} style={{ marginTop: '-10px' }}>
          <div className={classes.RowCard} style={{
            background: "linear-gradient(270deg, rgba(255, 255, 255, 0.20) -1.79%, rgba(255, 255, 255, 0.00) 100%), rgba(5, 110, 198, 0.20)",
            width: '49%'
          }}>
            <div className={classes.CardIcon}>
              <div className={classes.IconContent}>{walletIcon}</div>
            </div>
            <div className={classes.BCardContent}>
              <div className={classes.CardContentValue}>
                <span className={classes.MainValue}>
                  {isNaN(selectedDayData.salary) ? "0" : selectedDayData.salary.toFixed(2)}
                </span>
                <span className={classes.Currency}>MDL</span>
              </div>
              <div className={classes.SecondCardContent}>
                <span className={classes.SecondCardContentText}>
                  Payment for selected day {selectedDay ? <strong>({selectedDay.getDate()})</strong> : ''}
                </span>
              </div>
            </div>
          </div>

          <div className={classes.RowCard} style={{
            background: "linear-gradient(270deg, rgba(255, 255, 255, 0.20) -1.79%, rgba(255, 255, 255, 0.00) 100%), rgba(5, 110, 198, 0.20)",
            width: '49%'
          }}>
            <div className={classes.CardIcon}>
              <div className={classes.IconContent}>{walletIcon}</div>
            </div>
            <div className={classes.BCardContent}>
              <div className={classes.CardContentValue}>
                <span className={classes.MainValue}>
                  {isNaN(parseFloat(user?.salary || "0"))
                    ? "0"
                    : parseFloat(user?.salary || "0").toFixed(2)}
                </span>
                <span className={classes.Currency}>MDL</span>
              </div>
              <div className={classes.SecondCardContent}>
                <span className={classes.SecondCardContentText}>
                  Payment for <strong>{user?.salaryType === 'HOURLY' ? 'hourly' : 'month'}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.CalendarBody}>
          <DayPicker
            showOutsideDays
            ISOWeek
            mode="single"
            disableNavigation
            month={currentMonth}
            classNames={classNames}
            className={classes.Calendar}
            formatters={{ formatWeekdayName }}
            components={{ Day }}
            selected={selectedDay as Date}
            onSelect={(date: Date | undefined) => setSelectedDay(date || null)}
            onMonthChange={setCurrentMonth}
            modifiers={{
              hasData: (date) => {
                const month = date.toLocaleString('en-US', { month: 'long' });
                const day = date.getDate().toString();
                return Boolean(workHoursByDay[month]?.[day]);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SubListView;


