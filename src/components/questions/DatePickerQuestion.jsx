"use client";

import { useState } from "react";

// libs
import moment from "moment";

// icons
import { Calendar as CalendarIcon } from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// utilities
import { getMonth, getYear, setMonth, setYear } from "date-fns";
import { cn } from "@/lib/utils";

const DatePickerQuestion = (props = {}) => {
  // props
  const {
    field = {},
    form = {},
    question = {},
    disabled = false,
    start_year = getYear(new Date()) - 100,
    end_year = getYear(new Date()) + 100,
  } = props;

  const date = field.value || new Date();
  const setDate = field.onChange;

  // hooks
  const [is_open, setIsOpen] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: end_year - start_year + 1 },
    (_, i) => start_year + i
  );

  const handleMonthChange = (month) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year) => {
    const newDate = setYear(date, parseInt(year));
    setDate(newDate);
  };

  const handleSelect = (selectedData) => {
    if (selectedData) {
      setDate(selectedData);

      setIsOpen(false);
    }
  };

  return (
    <Popover open={is_open} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          {...field}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !field.value && "text-muted-foreground",
            form.formState.errors[question.id] && "border-destructive"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? (
            moment(field.value).format("DD/MM/YYYY")
          ) : (
            <span>{question.placeholder || "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(date)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={getYear(date).toString()}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          month={date}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerQuestion;
