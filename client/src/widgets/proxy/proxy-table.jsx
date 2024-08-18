import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
} from "@material-tailwind/react";
import { useState } from "react";


export const ProxyTable = ({ columns, title, dataSource, pageSize = 10, buttons = [] }) => {
  const [page, setPage] = useState(1);
  return (
    <Card className="h-full w-full">
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <div className="flex items-center justify-between gap-4">
          <Typography variant="h6" color="white">
            {title}
          </Typography>
          <div className="flex items-center gap-4">
            {buttons}
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {columns.map(({ key, title }) => (
                <th
                  key={`th_${key}`}
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[14px] font-bold uppercase text-blue-gray-400"
                  >
                    {title}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.slice((page - 1) * pageSize, page * pageSize).map(
              (record, index) => {
                const isLast = index === dataSource.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={record._id}>
                    {columns.map(({ key, dataIndex, render }) => (
                      <td className={classes} key={key || dataIndex}>
                        {render ?
                          dataIndex ?
                            render(record[dataIndex], record, (page - 1) * pageSize + index)
                            :
                            render(undefined, record, (page - 1) * pageSize + index)
                          :
                          dataIndex ?
                            record[dataIndex]
                            :
                            <></>
                        }
                      </td>
                    ))}
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button variant="outlined" size="sm" disabled={page === 1} onClick={() => setPage(page + 1)}>
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {
            Array.from({ length: (dataSource.length / pageSize) + 1 }, (_, i) => i + 1).map(i =>
              <IconButton variant="outlined" size="sm" onClick={() => setPage(i)}>
                {i}
              </IconButton>)
          }
        </div>
        <Button variant="outlined" size="sm" disabled={page === (dataSource.length / pageSize) + 1} onClick={() => setPage(page - 1)}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}