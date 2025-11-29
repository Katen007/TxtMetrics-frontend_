import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchReadIndxsById,
    fetchReadIndxsList,
    updateReadIndxs,
    updateTextMetrics,
    removeTextFromReadIndxs,
    formReadIndxs,
    deleteReadIndxs,
    resetOperationSuccess,
    clearCurrent
} from "../store/slices/readIndxsSlice";

import type { RootState, AppDispatch } from "../store";
import { Trash, CheckCircleFill, ExclamationCircle } from "react-bootstrap-icons";

export const DefaultImage = "/mock_images/default.png";

const STATUS_DRAFT = "draft";
const STATUS_COMPLETED = "completed";
const STATUS_REJECTED = "rejected";

export const OrderPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const { current, loading, operationSuccess } = useSelector(
        (state: RootState) => state.readIndxs
    );

    const [descriptions, setDescriptions] = useState<{ [key: number]: string }>({});

    /* ---------------------- LOAD ORDER ---------------------- */
    useEffect(() => {
        if (id) dispatch(fetchReadIndxsById(Number(id)));

        return () => {
            dispatch(clearCurrent());
            dispatch(resetOperationSuccess());
        };
    }, [id, dispatch]);

    /* ---------------------- SYNC TEXT DESCRIPTIONS ---------------------- */
    useEffect(() => {
        if (current?.texts) {
            const map: Record<number, string> = {};
            current.texts.forEach((t) => {
                map[t.id!] = t.description ?? "";
            });
            setDescriptions(map);
        }
    }, [current]);

    if (loading || !current)
        return (
            <Container className="pt-5">
                <p>Загрузка...</p>
            </Container>
        );

    const status = current.status ?? "draft";

    const isDraft = status === STATUS_DRAFT;
    const isCompleted = status === STATUS_COMPLETED;
    const isRejected = status === STATUS_REJECTED;

    /* ---------------------- SAVE BASIC INFO ---------------------- */
    const handleSaveMain = () => {
        const data: Record<string, any> = {
            status: current.status,
        };

        dispatch(updateReadIndxs({ id: current.id!, data }))
            .unwrap()
            .then(() => alert("Изменения сохранены!"))
            .catch(() => alert("Ошибка сохранения"));
    };

    /* ---------------------- UPDATE TEXT DESCRIPTION ---------------------- */
    const handleDescBlur = (textId: number) => {
        const desc = descriptions[textId];

        const body = {
            text_id: textId,
            read_indxs_id: current.id!,
            count_words: undefined,
            count_sentences: undefined,
            count_syllables: undefined
        } as any;

        dispatch(updateTextMetrics(body));
    };

    /* ---------------------- REMOVE TEXT ---------------------- */
    const handleRemoveText = (textId: number) => {
        if (!window.confirm("Удалить текст из заявки?")) return;

        dispatch(
            removeTextFromReadIndxs({
                read_indxs_id: current.id!,
                text_id: textId
            })
        );
    };

    /* ---------------------- FORM ORDER ---------------------- */
    const handleFormOrder = () => {
        dispatch(formReadIndxs(current.id!));
    };

    /* ---------------------- DELETE ORDER ---------------------- */
    const handleDeleteOrder = () => {
        if (!window.confirm("Удалить заявку целиком?")) return;

        dispatch(deleteReadIndxs(current.id!));
    };

    /* ---------------------- SUCCESS PAGE ---------------------- */
    if (operationSuccess) {
        return (
            <Container className="mt-5 pt-5 text-center">
                <Card className="p-5 shadow-sm border-0">
                    <h2 className="text-dark mb-3">Успешно!</h2>

                    <p className="text-muted">Действие выполнено.</p>

                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/texts">
                            <Button variant="outline-danger">К текстам</Button>
                        </Link>

                        <Link to="/readindxs">
                            <Button variant="danger">К списку заявок</Button>
                        </Link>
                    </div>
                </Card>
            </Container>
        );
    }

    /* ---------------------- MAIN RENDER ---------------------- */
    return (
        <Container className="pt-5 mt-5 pb-5">

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="text-center py-2">
                    <h4 className="fw-bold m-0">Заявка #{current.id}</h4>
                </Card.Body>
            </Card>

            {/* ---------------------- TEXTS LIST ---------------------- */}
            <div className="d-flex flex-column gap-3 mb-5">

                {current.texts?.map((t) => (
                    <Card key={t.id} className="border-0 shadow-sm">
                        <Card.Body className="p-0">
                            <Row className="g-0">
                                {/* LEFT SIDE */}
                                <Col md={4} className="d-flex align-items-center p-3 border-end">
                                    <div className="me-3" style={{ width: 60 }}>
                                        <Image src={t.image_url || DefaultImage} fluid rounded />
                                    </div>

                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-2">{t.title}</h6>
                                        <Link to={`/texts/${t.id}`}>
                                            <Button size="sm" variant="danger">
                                                Подробнее
                                            </Button>
                                        </Link>
                                    </div>

                                    {isDraft && (
                                        <Button
                                            variant="link"
                                            className="text-muted p-0 ms-2"
                                            onClick={() => handleRemoveText(t.id!)}
                                        >
                                            <Trash size={20} />
                                        </Button>
                                    )}
                                </Col>

                                {/* RIGHT SIDE — DESCRIPTION */}
                                <Col md={8} className="p-3 bg-light">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Описание..."
                                        value={descriptions[t.id!] || ""}
                                        onChange={(e) =>
                                            setDescriptions((prev) => ({
                                                ...prev,
                                                [t.id!]: e.target.value
                                            }))
                                        }
                                        onBlur={() => handleDescBlur(t.id!)}
                                        disabled={!isDraft}
                                        className="border-0 bg-white"
                                        style={{ resize: "none" }}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* ---------------------- ACTION BUTTONS ---------------------- */}
            {isDraft && (
                <Row>
                    <Col className="d-flex gap-2">
                        <Button variant="outline-success" onClick={handleSaveMain}>
                            Сохранить изменения
                        </Button>

                        <Button variant="outline-danger" onClick={handleDeleteOrder}>
                            Удалить заявку
                        </Button>
                    </Col>

                    <Col className="text-end">
                        <Button variant="outline-success" size="lg" onClick={handleFormOrder}>
                            Сформировать <CheckCircleFill className="ms-2" />
                        </Button>
                    </Col>
                </Row>
            )}

            {/* STATUS: REJECTED */}
            {isRejected && (
                <Card className="p-4 text-center mt-4 shadow-sm border-0">
                    <ExclamationCircle size={48} className="text-danger mb-3" />
                    <h5 className="text-danger fw-bold">Заявка отклонена</h5>
                </Card>
            )}
        </Container>
    );
};
