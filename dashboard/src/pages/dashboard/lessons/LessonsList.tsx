import { Button, List } from "antd";
import { Lesson } from "../../../store/store";
import { Link } from "react-router-dom";

type LessonsListProps = {
  lessons: Lesson[];
};

const LessonsList = ({ lessons }: LessonsListProps) => {
  return (
    <List
      size="large"
      bordered
      dataSource={lessons}
      renderItem={(lesson) => (
        <List.Item key={lesson.id}>
          <List.Item.Meta title={lesson.title} />
          <Link to={`/lessons/${lesson.id}`}>
            <Button>Open</Button>
          </Link>
        </List.Item>
      )}
    />
  );
};

export default LessonsList;
