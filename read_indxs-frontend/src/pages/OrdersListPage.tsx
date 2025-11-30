import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchReadIndxsList } from "../store/slices/readIndxsSlice";
import type { AppDispatch, RootState } from "../store";

type ReadIndxsListItem = {
  id: number;
  status?: string;
  date_create?: string;
  date_form?: string;
  date_end?: string;
  commenst?: string;
  contacts?: string;
  creator?: string;
  moderator?: string;
  calculations?: number[]; // optional
  texts_count?: number; // optional
};

const getStatusBadge = (status?: string) => {
  const s = status?.toLowerCase();

  switch (s) {
    case "draft":
    case "dрафт": // if by any chance localized
      return <Badge bg="secondary">Черновик</Badge>;
    case "deleted":
      return <Badge bg="dark">Удалена</Badge>;
    case "in_progress":
      return <Badge bg="primary">В работе</Badge>;
    case "completed":
      return <Badge bg="success">Завершена</Badge>;
    case "rejected":
      return <Badge bg="danger">Отклонена</Badge>;
    case "formed":
      return <Badge bg="info">Сформирована</Badge>;
    default:
      return (
        <Badge bg="light" text="dark">
          Неизвестно
        </Badge>
      );
  }
};

export const OrdersListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const list = useSelector((state: RootState) => state.readIndxs?.list ?? []);
  const loading = useSelector((state: RootState) => state.readIndxs?.loading ?? false);

  const [filters, setFilters] = useState({
    status: "all",
    date_from: "",
    date_to: "",
  });

  useEffect(() => {
    const params: any = {};
    if (filters.status && filters.status !== "all") params.status = filters.status.toUpperCase();
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    dispatch(fetchReadIndxsList(params));
  }, [filters, dispatch]);

  const handleRowClick = (id?: number) => {
    if (id) navigate(`/orders/${id}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<any>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Container className="pt-5 mt-5">
      <h2 className="fw-bold mb-4 text-center" style={{ color: "#495057" }}>
        История заявок
      </h2>

      <Card className="mb-4 border-0 shadow-sm bg-light">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Статус</Form.Label>
              <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="all">Все</option>
                <option value="draft">Черновик</option>
                <option value="in_progress">В работе</option>
                <option value="completed">Завершена</option>
                <option value="rejected">Отклонена</option>
                <option value="deleted">Удалена</option>
                <option value="formed">Сформирована</option>
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Label>Дата создания (от)</Form.Label>
              <Form.Control type="date" name="date_from" value={filters.date_from} onChange={handleFilterChange} />
            </Col>

            <Col md={4}>
              <Form.Label>Дата создания (до)</Form.Label>
              <Form.Control type="date" name="date_to" value={filters.date_to} onChange={handleFilterChange} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <Table hover className="align-middle mb-0 bg-white">
            <thead className="bg-light">
              <tr>
                <th>#</th>
                <th>Статус</th>
                <th>Создана</th>
                <th>Обновлена</th>
                <th>Кол-во текстов</th>
              </tr>
            </thead>

            <tbody>
              {list && list.length > 0 ? (
                list.map((order: ReadIndxsListItem) => {
                  const created = order.date_create ? new Date(order.date_create).toLocaleString("ru-RU") : null;
                  // map updated -> date_form if present, else date_end
                  const updated = order.date_form ? new Date(order.date_form).toLocaleString("ru-RU") : order.date_end ? new Date(order.date_end).toLocaleString("ru-RU") : null;
                  const textsCount =
                    Array.isArray(order.calculations) ? order.calculations.length : order.texts_count ?? 0;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => handleRowClick(order.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="fw-bold">{order.id}</td>
                      <td>{getStatusBadge(order.status)}</td>

                      <td>{created ?? <span className="text-muted">--</span>}</td>

                      <td>{updated ?? <span className="text-muted">--</span>}</td>

                      <td>{textsCount ?? 0}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    Заявок нет
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default OrdersListPage;