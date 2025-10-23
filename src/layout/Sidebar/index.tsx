import { Input, Calendar, Button } from '@arco-design/web-react';
import styles from './index.module.less';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarProps } from '@arco-design/web-react/es/Calendar/interface';
import { blogMetadata } from '../../mdFiles';
import { useEffect, useMemo, useState } from 'react';
import { IconClose } from '@arco-design/web-react/icon';
import TagCloud from '@/components/TagCloud';
import { useI18n } from '@/i18n';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const { t } = useI18n();
  // 追踪当前面板月份用于判定“非本月日期”
  const [panelMonth, setPanelMonth] = useState<string>(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${mm}`;
  });

  // searchValue也要跟随search变化
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    if (search) {
      setSearchValue(search);
    }
  }, [location.search]);

  // 获取当前URL中的日期参数
  const currentSelectedDate = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('date') || '';
  }, [location.search]);

  // 计算每天的文章数量
  const postCountByDate = useMemo(() => {
    const countMap: Record<string, number> = {};
    Object.values(blogMetadata).forEach((post) => {
      const dateStr = post.date;
      countMap[dateStr] = (countMap[dateStr] || 0) + 1;
    });
    return countMap;
  }, []);

  const handleDateSelect: CalendarProps['onChange'] = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    // 兼容之前的query
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('date', formattedDate);
    // 跳转到新的URL
    navigate(`/home?${searchParams.toString()}`);
  };

  // 面板月份变化时更新（点击左右箭头或选择头部下拉）
  const handlePanelChange: CalendarProps['onPanelChange'] = (date) => {
    setPanelMonth(date.format('YYYY-MM'));
  };

  const dateRender: CalendarProps['dateRender'] = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const count = postCountByDate[dateStr] || 0;
    const isSelected = dateStr === currentSelectedDate;
    const isInCurrentMonth = date.format('YYYY-MM') === panelMonth;

    const classNames = [styles.dateCell];
    if (isSelected) classNames.push(styles.selectedDate);
    if (count > 0) classNames.push(styles.dateWithPosts);
    if (!isInCurrentMonth) classNames.push(styles.notInMonth);

    return (
      <div className={classNames.join(' ')} aria-label={t('sidebar.dateAria', { date: dateStr, count })}>
        <span className={styles.dateNumber}>{date.date()}</span>
        {count > 0 && <span className={styles.postCount}>{count}</span>}
      </div>
    );
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchValue(value);

    // 如果搜索值为空，则不添加搜索参数到 URL
    if (value.trim() === '') {
      // 保留其他参数，如日期
      const currentParams = new URLSearchParams(location.search);
      currentParams.delete('search');

      // 如果还有其他参数，保留它们
      const paramString = currentParams.toString();
      navigate(paramString ? `/home?${paramString}` : '/home');
    } else {
      // 保留其他参数，如日期
      const currentParams = new URLSearchParams(location.search);
      currentParams.set('search', value);
      navigate(`/home?${currentParams.toString()}`);
    }
  };

  // 清除日期筛选
  const clearDateFilter = () => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.delete('date');
    const paramString = currentParams.toString();
    navigate(paramString ? `/home?${paramString}` : '/home');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.searchBox}>
        <Input.Search
          placeholder={t('sidebar.search.placeholder')}
          value={searchValue}
          onChange={setSearchValue}
          onSearch={handleSearch}
          allowClear
          onClear={() => {
            handleSearch('');
          }}
          onBlur={() => {
            handleSearch(searchValue);
          }}
        />
      </div>
      <div className={styles.calendarBox}>
        <div className={styles.calendarHeader}>
          <span>{t('sidebar.dateFilter')}</span>
          {currentSelectedDate && (
            <Button
              type="text"
              size="mini"
              icon={<IconClose />}
              onClick={clearDateFilter}
              className={styles.clearDateBtn}
            >
              {t('sidebar.clear')}
            </Button>
          )}
        </div>
        <Calendar
          panelTodayBtn
          panel
          style={{ width: '100%' }}
          onChange={handleDateSelect}
          onPanelChange={handlePanelChange}
          dateRender={dateRender}
        />
      </div>
      <TagCloud />
    </div>
  );
};

export default Sidebar;
