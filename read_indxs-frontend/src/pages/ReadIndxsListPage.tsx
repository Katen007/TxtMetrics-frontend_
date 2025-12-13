import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Card,
  ListGroup,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ExclamationCircleFill,
  Funnel,
  PersonFill,
  CheckLg,
  XCircleFill,
} from "react-bootstrap-icons";

import {
  fetchReadIndxsList,
  moderateReadIndxs,
} from "../store/slices/readIndxsSlice";
import type { AppDispatch, RootState } from "../store";

import "./styles/ReadIndxsListPage.css";

const STATUS = {
  DRAFT: "DRAFT",
  FORMED: "FORMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
  DELETED: "DELETED",
};

const normalizeStatus = (s?: string) => (s || "").toUpperCase();

const isModerationPending = (status?: string) => {
  const s = normalizeStatus(status);
  return s === STATUS.FORMED || s === STATUS.IN_PROGRESS;
};

const getStatusBadge = (status?: string) => {
  const s = normalizeStatus(status);

  switch (s) {
    case STATUS.DRAFT:
      return <Badge bg="secondary">Черновик</Badge>;
    case STATUS.FORMED:
      return <Badge bg="info">Сформирована</Badge>;
    case STATUS.IN_PROGRESS:
      return <Badge bg="primary">В работе</Badge>;
    case STATUS.COMPLETED:
      return <Badge bg="success">Завершена</Badge>;
    case STATUS.REJECTED:
      return <Badge bg="danger">Отклонена</Badge>;
    case STATUS.DELETED:
      return <Badge bg="dark">Удалена</Badge>;
    default:
      return (
        <Badge bg="light" text="dark">
          Неизвестно
        </Badge>
      );
  }
};

const toDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("ru-RU");
};

// формат для input[type="date"] -> YYYY-MM-DD
const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// создатель – логин (строка)
const extractCreatorLogin = (order: any): string => {
  const raw =
    order?.creator_login ?? // основной вариант
    order?.creator ?? // запасной
    order?.user_login ?? // если бэк назвал иначе
    order?.user ?? null;

  if (!raw) return "—";
  return String(raw);
};

export const ReadIndexsListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { list, loading } = useSelector((state: RootState) => state.readIndxs);
  const { user } = useSelector((state: RootState) => state.user);

  const isModerator = !!user?.is_moderator;

  // API-фильтры (бэкенд) — по умолчанию date_to = сегодня
  const [apiFilters, setApiFilters] = useState(() => {
    const todayStr = formatDateInput(new Date());
    const fromdayStr = formatDateInput(
      new Date(new Date().setDate(new Date().getDate() - 1))
    );
    return {
      status: "all",
      date_from: fromdayStr,
      date_to: todayStr, // <- сегодняшняя дата по умолчанию
    };
  });

  // Фильтр по создателю (логин, фронт, только модератор)
  const [selectedCreatorLogin, setSelectedCreatorLogin] = useState<
    string | "all"
  >("all");

  // --- SHORT POLLING ---
  useEffect(() => {
    const buildParams = () => {
      const params: any = {};
      if (apiFilters.status && apiFilters.status !== "all") {
        params.status = normalizeStatus(apiFilters.status);
      }
      if (apiFilters.date_from) params.date_from = apiFilters.date_from;
      if (apiFilters.date_to) params.date_to = apiFilters.date_to;
      return params;
    };

    const loadData = () => dispatch(fetchReadIndxsList(buildParams()));

    loadData();
    const intervalId = setInterval(loadData, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, apiFilters]);

  // --- Список пользователей для панели модератора (по логину) ---
  const creatorsStats = useMemo(() => {
    if (!isModerator) return [];

    const stats = new Map<string, { total: number; pending: number }>();

    (list || []).forEach((order: any) => {
      const login = extractCreatorLogin(order);
      if (login === "—") return; // заявки без логина не учитываем

      if (!stats.has(login)) {
        stats.set(login, { total: 0, pending: 0 });
      }

      const s = stats.get(login)!;
      s.total += 1;
      if (isModerationPending(order.status)) s.pending += 1;
    });

    return Array.from(stats.entries()).map(([login, v]) => ({
      login,
      total: v.total,
      pending: v.pending,
    }));
  }, [list, isModerator]);

  // --- Фронт-фильтрация по логину создателя ---
  const displayedList = useMemo(() => {
    if (!list) return [];
    if (!isModerator) return list;

    if (selectedCreatorLogin === "all") return list;

    return list.filter(
      (o: any) => extractCreatorLogin(o) === selectedCreatorLogin
    );
  }, [list, isModerator, selectedCreatorLogin]);

  const handleRowClick = (id?: number) => {
    if (id) navigate(`/readIndxs/${id}`);
  };

  const handleApiFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setApiFilters({ ...apiFilters, [e.target.name]: e.target.value });
  };

  const handleModerate = (
    e: React.MouseEvent,
    id: number,
    action: "complete" | "reject"
  ) => {
    e.stopPropagation();
    dispatch(moderateReadIndxs({ id, action }));
  };

  return (
    <Container fluid className="pt-5 mt-5 px-4">
      <h2 className="fw-bold mb-4 text-center text-secondary">
        {isModerator ? "Панель модератора" : "История заявок"}
      </h2>

      <Row>
        {/* Левая колонка модератора: пользователи */}
        {isModerator && (
          <Col lg={3} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-white border-0 fw-bold d-flex align-items-center gap-2 user-panel-title">
        <PersonFill /> Пользователи
      </Card.Header>

              <ListGroup variant="flush" className="user-filter-list">
                <ListGroup.Item
                  action
                  active={selectedCreatorLogin === "all"}
                  onClick={() => setSelectedCreatorLogin("all")}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>Все пользователи</span>
                  <Badge bg="secondary" pill>
                    {list.length}
                  </Badge>
                </ListGroup.Item>

                {creatorsStats.map((c) => (
                  <ListGroup.Item
                    key={c.login}
                    action
                    active={selectedCreatorLogin === c.login}
                    onClick={() => setSelectedCreatorLogin(c.login)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>{c.login}</span>
                    <div className="d-flex gap-2 align-items-center">
                      {c.pending > 0 && (
                        <ExclamationCircleFill
                          className="text-danger blink-icon"
                          title="Есть необработанные заявки"
                        />
                      )}
                      <Badge bg="light" text="dark" pill>
                        {c.total}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        )}

        {/* Правая колонка: фильтры + плитка заявок */}
        <Col lg={isModerator ? 9 : 12}>
          <Card className="mb-4 border-0 shadow-sm bg-white">
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col md={isModerator ? 3 : 4}>
                  <Form.Label className="fw-bold small text-muted">
                    Статус
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={apiFilters.status}
                    onChange={handleApiFilterChange}
                    size="sm"
                  >
                    <option value="all">Все статусы</option>
                    <option value="FORMED">Сформирована</option>
                    <option value="IN_PROGRESS">В работе</option>
                    <option value="COMPLETED">Завершена</option>
                    <option value="REJECTED">Отклонена</option>
                    <option value="DRAFT">Черновик</option>
                  </Form.Select>
                </Col>

                <Col md={isModerator ? 3 : 4}>
                  <Form.Label className="fw-bold small text-muted">
                    Дата формирования от
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date_from"
                    value={apiFilters.date_from}
                    onChange={handleApiFilterChange}
                    size="sm"
                  />
                </Col>

                <Col md={isModerator ? 3 : 4}>
                  <Form.Label className="fw-bold small text-muted">
                    Дата формирования до
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date_to"
                    value={apiFilters.date_to}
                    onChange={handleApiFilterChange}
                    size="sm"
                  />
                </Col>

                {isModerator && (
                  <Col md={3} className="text-end">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        const params: any = {};
                        if (apiFilters.status !== "all")
                          params.status = normalizeStatus(apiFilters.status);
                        if (apiFilters.date_from)
                          params.date_from = apiFilters.date_from;
                        if (apiFilters.date_to)
                          params.date_to = apiFilters.date_to;
                        dispatch(fetchReadIndxsList(params));
                      }}
                    >
                      Обновить <Funnel />
                    </Button>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>

          {loading && list.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  <div className="small text-muted">
                    Найдено заявок:{" "}
                    <strong>{displayedList.length}</strong>
                  </div>
                </Col>
              </Row>

              {displayedList.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  Заявок не найдено
                </div>
              ) : (
                <Row className="g-4">
                  {displayedList.map((order: any) => {
                    const calculations = Array.isArray(order.calculations)
                      ? order.calculations
                      : [];
                    const total = calculations.length;
                    const nonEmpty = calculations.filter(
                      (v: any) => v !== 0 && v !== undefined
                    ).length;

                    const creatorLogin = extractCreatorLogin(order);

                    const cardHighlight =
                      isModerator && isModerationPending(order.status)
                        ? "table-warning-soft"
                        : "";

                    return (
                      <Col key={order.id} md={6} lg={4}>
                        <Card
                          className={`h-100 shadow-sm border-0 ${cardHighlight}`}
                          onClick={() => handleRowClick(order.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <div className="fw-bold">
                                  Заявка №{order.id}
                                </div>
                                {isModerator && (
                                  <div className="small text-muted">
                                    {creatorLogin === "—"
                                      ? "—"
                                      : `Пользователь ${creatorLogin}`}
                                  </div>
                                )}
                              </div>
                              {getStatusBadge(order.status)}
                            </div>

                            <div className="small text-muted mb-2">
                              <div>
                                Дата создания:{" "}
                                {order.date_create
                                  ? toDate(order.date_create)
                                  : "-"}
                              </div>
                              <div>
                                Дата формирования:{" "}
                                {order.date_form
                                  ? toDate(order.date_form)
                                  : "-"}
                              </div>
                            </div>

                            <hr />

                            <div className="small">
                              Готовые результаты:{" "}
                              {total > 0 ? (
                                <strong>
                                  {nonEmpty}/{total}
                                </strong>
                              ) : (
                                <span className="text-muted">0</span>
                              )}
                            </div>
                          </Card.Body>

                          {isModerator && (
                            <Card.Footer className="bg-transparent border-0 pt-0 pb-3 px-3">
                              {isModerationPending(order.status) ? (
                                <div className="d-flex justify-content-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={(e) =>
                                      handleModerate(e, order.id, "reject")
                                    }
                                    title="Отклонить"
                                  >
                                    <XCircleFill />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={(e) =>
                                      handleModerate(e, order.id, "complete")
                                    }
                                    title="Принять"
                                  >
                                    <CheckLg />
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-muted small">
                                  {/* как и в таблице: просто тире */}
                                  
                                </span>
                              )}
                            </Card.Footer>
                          )}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ReadIndexsListPage;
