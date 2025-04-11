import { useForm, Controller } from "react-hook-form";
import { Select } from "antd";
import { Lesson } from "../../../store/store";
import { Button, Input, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import DateTimePicker from "./DateTimePicker";

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
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: lesson.title,
      points: lesson.points,
      comment: lesson.comment,
      status: lesson.status,
      deadline: lesson.deadline,
    },
  });

  const onSubmit = (data: unknown) => console.log(data);
  console.log(errors);

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
    </form>
  );
};

export default FormContainer;
