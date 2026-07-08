"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import HolidayService from "@/services/holiday.service";

export interface HolidayItem {
  date: string;
  description: string;
  type: string;
}

export function useHolidays() {
  const [holidayList, setHolidayList] = useState<HolidayItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    HolidayService.getAll().then((res) => {
      setHolidayList(res.result || []);
    }).catch(() => {
      setHolidayList([]);
    }).finally(() => {
      setLoaded(true);
    });
  }, []);

  const refresh = useCallback(async () => {
    const res = await HolidayService.getAll();
    setHolidayList(res.result || []);
  }, []);

  const holidays = useMemo(() => holidayList.map((h) => h.date), [holidayList]);

  const isHoliday = useCallback((date: string) => holidays.includes(date), [holidays]);

  const getHoliday = useCallback((date: string) => holidayList.find((h) => h.date === date), [holidayList]);

  return { holidayList, holidays, loaded, refresh, isHoliday, getHoliday };
}
