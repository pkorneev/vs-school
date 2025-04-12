import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Select } from "antd";
import { Lesson } from "../../../store/store";
import { Button, Input, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import DateTimePicker from "./DateTimePicker";
import { useEffect } from "react";

type FormContainerProps = {
  lesson: Lesson;
};

const statusOptions = [
  { value: "TO_DO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "COMPLETED", label: "Completed" },
];

const FormContainer = ({ lesson }: FormContainerProps) => {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: lesson.title,
      points: lesson.points,
      comment: lesson.comment,
      status: lesson.status,
      deadline: lesson.deadline,
      files: lesson.files,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "files",
  });

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title,
        points: lesson.points,
        comment: lesson.comment,
        status: lesson.status,
        deadline: lesson.deadline,
        files: lesson.files,
      });
    }
  }, [lesson, reset]);

  const onSubmit = (data: unknown) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form__lesson">
      <div className="form__lesson--input">
        <label htmlFor="title">Title</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </div>
      <div className="form__lesson--input">
        <label htmlFor="points">Points</label>
        <Controller
          name="points"
          control={control}
          render={({ field }) => <InputNumber {...field} />}
        />
      </div>
      <div className="form__lesson--input">
        <label htmlFor="comment">Comment</label>
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <TextArea {...field} autoSize={{ minRows: 3, maxRows: 5 }} />
          )}
        />
      </div>
      <div className="form__lesson--input">
        <label htmlFor="status">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => <Select {...field} options={statusOptions} />}
        />
      </div>
      <div className="form__lesson--input">
        <label htmlFor="deadline">Deadline</label>
        <DateTimePicker
          initialValue={lesson.deadline}
          onChange={(value) => setValue("deadline", value)}
        />
      </div>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
      <div className="form__lesson--files">
        {fields.map((file, index) => (
          <div
            key={file.id}
            style={{
              marginBottom: "2rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div
              style={{
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              📄 {file.path}
            </div>
            <Controller
              name={`files.${index}.content`}
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  autoSize={{ minRows: 5 }}
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#1e1e1e",
                    color: "#dcdcdc",
                    borderRadius: "6px",
                  }}
                />
              )}
            />
          </div>
        ))}
      </div>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </form>
  );
};

export default FormContainer;
