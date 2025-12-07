import React, { useEffect, useState } from "react";
import {
  Container,
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
    case "dрафт":
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

// утилита: формат даты (строка -> локальная строка)
const formatDateTime = (value?: string) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("ru-RU");
};

// утилита: сегодня и вчера в формате yyyy-mm-dd
const getDefaultDateFilters = () => {
  const toISO = (d: Date) => d.toISOString().slice(0, 10);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return {
    date_from: toISO(yesterday),
    date_to: toISO(today),
  };
};

export const ReadIndexsListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const list = useSelector((state: RootState) => state.readIndxs?.list ?? []);
  const loading = useSelector((state: RootState) => state.readIndxs?.loading ?? false);

  const defaultDates = getDefaultDateFilters();

  const [filters, setFilters] = useState({
    status: "all",
    date_from: defaultDates.date_from,
    date_to: defaultDates.date_to,
  });

  useEffect(() => {
    const params: any = {};
    if (filters.status && filters.status !== "all") {
      params.status = filters.status.toUpperCase();
    }
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    dispatch(fetchReadIndxsList(params));
  }, [filters, dispatch]);

  const handleCardClick = (id?: number) => {
    if (id) navigate(`/orders/${id}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<any>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const totalFound = list?.length ?? 0;

  return (
    <Container className="pt-5 mt-5">
      <h2 className="fw-bold mb-4 text-center" style={{ color: "#495057" }}>
        История заявок
      </h2>

      {/* Фильтры */}
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
              <Form.Control
                type="date"
                name="date_from"
                value={filters.date_from}
                onChange={handleFilterChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label>Дата создания (до)</Form.Label>
              <Form.Control
                type="date"
                name="date_to"
                value={filters.date_to}
                onChange={handleFilterChange}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Информация по количеству найденных заявок */}
      {!loading && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-muted">
            Найдено заявок: <b>{totalFound}</b>
          </div>
          {(filters.date_from || filters.date_to) && (
            <small className="text-secondary">
              Период: {filters.date_from || "—"} — {filters.date_to || "—"}
            </small>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : totalFound > 0 ? (
        // Заявки в виде карточек
        <Row xs={1} md={2} lg={3} className="g-3">
          {list.map((order: ReadIndxsListItem) => {
            const created = formatDateTime(order.date_create);
            const updated =
              formatDateTime(order.date_form) ||
              formatDateTime(order.date_end);

            const calculationsArray = Array.isArray(order.calculations)
              ? order.calculations
              : [];

            const nonEmptyCalculations = calculationsArray.filter(
              (v) => v !== null && v !== undefined
            );
            const totalResults = calculationsArray.length;
            const nonEmptyCount = nonEmptyCalculations.length;

            const avgReadIndex =
              nonEmptyCount > 0
                ? nonEmptyCalculations.reduce((sum, val) => sum + val, 0) /
                  nonEmptyCount
                : null;

            return (
              <Col key={order.id}>
                <Card
                  className="h-100 shadow-sm border-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCardClick(order.id)}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Card.Title className="mb-0 me-2">
                        Заявка №{order.id}
                      </Card.Title>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="small text-muted mb-2">
                      <div>
                        Создана: {created || <span className="text-muted">--</span>}
                      </div>
                      <div>
                        Обновлена: {updated || <span className="text-muted">--</span>}
                      </div>
                    </div>

                    <hr className="my-2" />

                    {/* Блок результатов ReadIndex вместо "кол-во текстов" */}
                    <div className="mt-2">
                      <div className="fw-semibold small mb-1">
                        Результаты ReadIndex
                      </div>

                      {totalResults > 1 ? (
                        <>
                          <div className="small">
                            Непустых результатов:{" "}
                            <b>
                              {nonEmptyCount}/{totalResults}
                            </b>
                          </div>
                          {avgReadIndex !== null && (
                            <div className="small">
                              Средний индекс:{" "}
                              <b>{avgReadIndex.toFixed(2)}</b>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="small text-muted">
                          Результатов пока нет
                        </div>
                      )}
                    </div>

                    {/* {order.contacts && (
                      <div className="mt-3 small text-muted">
                        Контакты: {order.contacts}
                      </div>
                    )} */}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className="text-center py-4 text-muted">
          Заявок нет
        </div>
      )}
    </Container>
  );
};

export default ReadIndexsListPage;
