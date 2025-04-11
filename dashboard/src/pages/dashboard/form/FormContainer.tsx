import { useForm, Controller } from "react-hook-form";
import { Lesson } from "../../../store/store";
import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";

type FormContainerProps = {
  lesson: Lesson;
};
const FormContainer = ({ lesson }: FormContainerProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: lesson.title,
      points: lesson.points,
      comment: lesson.comment,
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
          render={({ field }) => <Input {...field} />}
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

      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </form>
  );
};

export default FormContainer;
