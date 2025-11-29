import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Spinner, Card, Form, Image, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchReadIndxsById,
  deleteReadIndxs,
  formReadIndxs,
  removeTextFromReadIndxs,
  updateTextMetrics,
  updateReadIndxs,
} from "../store/slices/readIndxsSlice";
import type { HandlerMmBody, HandlerMmBodyDelete, DsReadIndxsToText, DsText } from "../api/Api";

import "./styles/OrderPage.css";

type MetricsState = Record<
  number,
  {
    sentences: string;
    words: string;
    syllables: string;
  }
>;

export const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { current, loading } = useSelector((state: RootState) => state.readIndxs);
  const { user } = useSelector((state: RootState) => state.user);

  const isDraft = current?.status === "DRAFT";
  const texts = (current?.texts as DsReadIndxsToText[]) || [];

  const [metrics, setMetrics] = useState<MetricsState>({});
  const [commenst, setCommenst] = useState<string>("");
  const [contacts, setContacts] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    dispatch(fetchReadIndxsById(Number(id)));
  }, [dispatch, id]);

  // init local metrics and top-level fields
  useEffect(() => {
    if (!current) return;

    setCommenst(current.comments ?? "");
    setContacts(current.contacts ?? "");

    const next: MetricsState = {};
    (current.texts as DsReadIndxsToText[] | undefined)?.forEach((t) => {
      const textId = t.data?.id;
      if (!textId) return;
      next[textId] = {
        sentences: t.count_sentences !== undefined && t.count_sentences !== null ? String(t.count_sentences) : "",
        words: t.count_words !== undefined && t.count_words !== null ? String(t.count_words) : "",
        syllables: t.count_syllables !== undefined && t.count_syllables !== null ? String(t.count_syllables) : "",
      };
    });
    setMetrics(next);
  }, [current]);

  const handleMetricChange = (textId: number, field: keyof MetricsState[number], value: string) => {
    setMetrics((prev) => ({
      ...prev,
      [textId]: { ...(prev[textId] || { sentences: "", words: "", syllables: "" }), [field]: value },
    }));
  };

  // on blur — send only changed numeric values (convert to int or undefined)
  const handleMetricsBlur = async (textId: number) => {
    if (!current?.id) return;
    const m = metrics[textId];
    if (!m) return;

    const payload: HandlerMmBody = {
      read_indxs_id: current.id,
      text_id: textId,
    };

    if (m.words !== "") payload.count_words = Number(m.words);
    if (m.sentences !== "") payload.count_sentences = Number(m.sentences);
    if (m.syllables !== "") payload.count_syllables = Number(m.syllables);

    await dispatch(updateTextMetrics(payload));
  };

  const handleDeleteText = async (textId: number) => {
    if (!current?.id) return;
    const payload: HandlerMmBodyDelete = {
      read_indxs_id: current.id,
      text_id: textId,
    };
    await dispatch(removeTextFromReadIndxs(payload));
  };

  const handleFormReadIndxs = async () => {
    if (!current?.id) return;
    await dispatch(formReadIndxs(current.id));
  };

  const handleDeleteRequest = async () => {
    if (!current?.id) return;
    await dispatch(deleteReadIndxs(current.id));
    navigate("/orders");
  };

  // on blur for top-level fields
  const handleRequestFieldsBlur = async () => {
    if (!current?.id) return;
    await dispatch(updateReadIndxs({ id: current.id, data: { comments: commenst || undefined, contacts: contacts || undefined } }));
  };

  if (loading || !current) {
    return (
      <Container className="mt-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="order-page mt-4">
      <div className="order-header mb-4">
        <h2>Заявка №{current.id}</h2>
        <p>
          Статус: <b>{current.status}</b>
        </p>
        <p>
          Пользователь: <b>{user?.login ?? "—"}</b>
        </p>
      </div>

      <Card className="mb-4 p-3">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Комментарий к заявке</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={commenst}
              onChange={(e) => setCommenst(e.target.value)}
              onBlur={handleRequestFieldsBlur}
              placeholder="Комментарий к заявке"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Контакты</Form.Label>
            <Form.Control
              type="text"
              value={contacts}
              onChange={(e) => setContacts(e.target.value)}
              onBlur={handleRequestFieldsBlur}
              placeholder="Email / телефон"
            />
          </Form.Group>
        </Form>
      </Card>

      {texts.length > 0 ? (
        texts.map((t, i) => {
          const textId = t.data?.id ?? i;
          const textData: DsText | undefined = t.data;
          const m = metrics[textId] || { sentences: "", words: "", syllables: "" };

          return (
            <Card key={textId} className="order-text-card mb-3 shadow-sm">
              <div className="order-text-card-body d-flex align-items-center">
                <Image
                  src={textData?.image_url || "//localhost:9000/img/img/his.jpg"}
                  alt={textData?.title}
                  className="order-text-image"
                />

                <div className="order-text-info flex-grow-1 mx-3">
                  <h5 className="order-text-title">{textData?.title}</h5>

                  <div className="order-text-fields d-flex flex-wrap gap-3 mt-2">
                    <div className="d-flex flex-column">
                      <label>Индекс читаемости:</label>
                      <Form.Control readOnly value={t.calculation ?? ""} style={{ width: 100 }} />
                    </div>

                    <div className="d-flex flex-column">
                      <label>Предложений:</label>
                      <Form.Control
                        value={m.sentences}
                        style={{ width: 100 }}
                        onChange={(e) => handleMetricChange(textId as number, "sentences", e.target.value)}
                        onBlur={() => handleMetricsBlur(textId as number)}
                      />
                    </div>

                    <div className="d-flex flex-column">
                      <label>Слов:</label>
                      <Form.Control
                        value={m.words}
                        style={{ width: 100 }}
                        onChange={(e) => handleMetricChange(textId as number, "words", e.target.value)}
                        onBlur={() => handleMetricsBlur(textId as number)}
                      />
                    </div>

                    <div className="d-flex flex-column">
                      <label>Слогов:</label>
                      <Form.Control
                        value={m.syllables}
                        style={{ width: 100 }}
                        onChange={(e) => handleMetricChange(textId as number, "syllables", e.target.value)}
                        onBlur={() => handleMetricsBlur(textId as number)}
                      />
                    </div>
                  </div>
                </div>

                <div className="order-actions d-flex flex-column gap-2">
                  <Link to={`/texts/${textId}`}>
                    <Button variant="warning" size="sm">
                      Подробнее
                    </Button>
                  </Link>
                  {isDraft && (
                    <Button variant="danger" size="sm" onClick={() => handleDeleteText(textId as number)}>
                      Удалить
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })
      ) : (
        <p>В заявке пока нет добавленных текстов.</p>
      )}

      <Row className="mt-4">
        <Col xs={12} md={6}>
          <Button variant="outline-danger" onClick={handleDeleteRequest}>
            Удалить заявку
          </Button>
        </Col>
        <Col xs={12} md={6} className="text-end">
          <Button variant="success" onClick={handleFormReadIndxs} disabled={!isDraft}>
            Отправить заявку
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;