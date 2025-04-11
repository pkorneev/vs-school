import { useEffect, useState } from "react";
import { DatePicker, TimePicker, Space } from "antd";
import dayjs from "dayjs";

type DateTimePickerProps = {
  initialValue: string;
  onChange: (value: string) => void;
};

const DateTimePicker = ({ initialValue, onChange }: DateTimePickerProps) => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [time, setTime] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    if (initialValue) {
      const dateTime = dayjs(initialValue);
      setDate(dateTime);
      setTime(dateTime);
    }
  }, [initialValue]);

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setDate(date);
    if (date && time) {
      const isoDate = `${date.format("YYYY-MM-DD")}T${time.format(
        "HH:mm:ss.SSS"
      )}`;
      onChange(isoDate);
    }
  };

  const handleTimeChange = (time: dayjs.Dayjs | null) => {
    setTime(time);
    if (date && time) {
      const isoDate = `${date.format("YYYY-MM-DD")}T${time.format(
        "HH:mm:ss.SSS"
      )}`;
      onChange(isoDate);
    }
  };

  return (
    <Space>
      <DatePicker
        value={date}
        onChange={handleDateChange}
        format="YYYY-MM-DD"
        placeholder="Select date"
      />
      <TimePicker
        value={time}
        onChange={handleTimeChange}
        format="HH:mm"
        placeholder="Select time"
      />
    </Space>
  );
};

export default DateTimePicker;
