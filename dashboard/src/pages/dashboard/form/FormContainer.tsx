import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Select } from "antd";
import {
  File,
  Lesson,
  notifyAtom,
  Status,
  tokenAtom,
} from "../../../store/store";
import { Button, Input, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import DateTimePicker from "./DateTimePicker";
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { createLesson, updateLesson } from "../../../utils/http";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type FormContainerProps = {
  lesson?: Lesson;
  refetchLesson?: () => void;
};

export type FormData = {
  deadline: string;
  title: string;
  files: File[];
  status?: Status;
  points?: number;
  comment?: string;
};

const statusOptions = [
  { value: "TO_DO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "COMPLETED", label: "Completed" },
];

const FormContainer = ({ lesson, refetchLesson }: FormContainerProps) => {
  const token = useAtomValue(tokenAtom);
  const notify = useSetAtom(notifyAtom);
  const navigate = useNavigate();
  const { control, handleSubmit, setValue, reset } = useForm<FormData>({
    defaultValues: lesson
      ? {
          title: lesson.title,
          points: lesson.points,
          comment: lesson.comment,
          status: lesson.status,
          deadline: lesson.deadline,
          files: lesson.files,
        }
      : {
          title: "",
          points: undefined,
          comment: "",
          status: undefined,
          deadline: "",
          files: [{ path: "", name: "", content: "" }], // Initialize an empty file if no lesson exists
        },
  });

  const { fields, append, remove } = useFieldArray({
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

  const onSubmit = (formData: FormData) => {
    if (!token) return;

    if (lesson) {
      const mergedLesson = {
        ...lesson,
        ...formData,
        files: formData.files,
      };

      updateLesson(lesson.id, mergedLesson, token)
        .then((res) => {
          notify({
            type: "success",
            description: "You have successfully updated the lesson!",
          });
          console.log("Lesson updated:", res);
          refetchLesson?.();
        })
        .catch((err) => {
          notify({
            type: "error",
            description: "Error while updating lesson!",
          });
          console.error("Update error:", err);
        });
    } else {
      createLesson(formData, token)
        .then((res) => {
          notify({
            type: "success",
            description: "You have successfully created the lesson!",
          });
          console.log("Lesson created:", res);
          navigate("/lessons");
        })
        .catch((err) => {
          notify({
            type: "error",
            description: "Error while creating lesson!",
          });
          console.error("Create error:", err);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form__lesson">
      <div className="form__lesson--input">
        <label htmlFor="title">Title</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field, fieldState }) => (
            <>
              <Input {...field} />
              {fieldState?.error && (
                <span style={{ color: "red" }}>{fieldState.error.message}</span>
              )}
            </>
          )}
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
          rules={{ required: "Status is required" }}
          render={({ field, fieldState }) => (
            <>
              <Select {...field} options={statusOptions} />
              {fieldState?.error && (
                <span style={{ color: "red" }}>{fieldState.error.message}</span>
              )}
            </>
          )}
        />
      </div>
      <div className="form__lesson--input">
        <label htmlFor="deadline">Deadline</label>
        <DateTimePicker
          initialValue={lesson?.deadline ?? new Date().toISOString()}
          onChange={(value) => setValue("deadline", value)}
        />
      </div>
      <div className="form__lesson--files">
        {fields.map((file, index) => (
          <div
            key={file.id}
            className="file__element--content"
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
              📄 {file.name}
            </div>
            <Controller
              name={`files.${index}.name`}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="File name" />
              )}
            />
            <Controller
              name={`files.${index}.path`}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="File path" />
              )}
            />
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
            <Button
              color="danger"
              variant="solid"
              onClick={() => remove(index)}
            >
              Remove File
            </Button>
          </div>
        ))}
      </div>
      {!lesson && (
        <Button
          onClick={() =>
            append({
              path: "",
              name: "",
              content: "",
            })
          }
          className="form__lesson--add"
        >
          <PlusOutlined />
          Add File
        </Button>
      )}
      <Button type="primary" htmlType="submit" className="form__lesson--save">
        Save
      </Button>
    </form>
  );
};

export default FormContainer;
