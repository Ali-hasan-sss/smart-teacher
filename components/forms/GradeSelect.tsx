"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

interface Grade {
  id: number;
  title: string;
}

interface GradeSelectProps {
  value: number | null;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

export default function GradeSelect({
  value,
  onChange,
  placeholder = "اختر الصف",
  className,
}: GradeSelectProps) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/Client/Grade/List");
        setGrades(res.data.data.items || []);
      } catch (err) {
        console.error("خطأ في جلب الصفوف:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return (
    <Select
      value={value?.toString() ?? ""}
      onValueChange={(val) => onChange(Number(val))}
      disabled={loading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {grades.map((grade) => (
          <SelectItem key={grade.id} value={grade.id.toString()}>
            {grade.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
