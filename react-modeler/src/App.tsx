import {BpmnModeler} from "@miragon/camunda-web-modeler";
import CustomBpmnJsModeler from "@miragon/camunda-web-modeler/dist/bpmnio/bpmn/CustomBpmnJsModeler";
import {isBpmnIoEvent} from "@miragon/camunda-web-modeler/dist/events/bpmnio/BpmnIoEvents";
import {Event} from "@miragon/camunda-web-modeler/dist/events/Events";
import {
    ContentSavedReason,
    isContentSavedEvent
} from "@miragon/camunda-web-modeler/dist/events/modeler/ContentSavedEvent";
import {isNotificationEvent} from "@miragon/camunda-web-modeler/dist/events/modeler/NotificationEvent";
import {isPropertiesPanelResizedEvent} from "@miragon/camunda-web-modeler/dist/events/modeler/PropertiesPanelResizedEvent";
import {isUIUpdateRequiredEvent} from "@miragon/camunda-web-modeler/dist/events/modeler/UIUpdateRequiredEvent";
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

const App: React.FC = () => {
    const modelerRef = useRef<CustomBpmnJsModeler>();

    const [xml, setXml] = useState<string>("");

    useEffect(() => {
        // Use demo XML
        setXml(BPMN);
    }, []);

    const onXmlChanged = useCallback((
        newXml: string,
        newSvg: string | undefined,
        reason: ContentSavedReason
    ) => {
        console.log(`Model has been changed because of ${reason}`);
        // Do whatever you want here, save the XML and SVG in the backend etc.
        setXml(newXml);
    }, []);

    const onSaveClicked = useCallback(async () => {
        if (!modelerRef.current) {
            // Should actually never happen, but required for type safety
            return;
        }

        console.log("Saving model...");
        const result = await modelerRef.current.save();
        console.log("Saved model!", result.xml, result.svg);
    }, []);

    const onEvent = useCallback(async (event: Event<any>) => {
        if (isContentSavedEvent(event)) {
            // Content has been saved, e.g. because user edited the model or because he switched
            // from BPMN to XML.
            onXmlChanged(event.data.xml, event.data.svg, event.data.reason);
            return;
        }

        if (isNotificationEvent(event)) {
            // There's a notification the user is supposed to see, e.g. the model could not be
            // imported because it was invalid.
            return;
        }

        if (isUIUpdateRequiredEvent(event)) {
            // Something in the modeler has changed and the UI (e.g. menu) should be updated.
            // This happens when the user selects an element, for example.
            return;
        }

        if (isPropertiesPanelResizedEvent(event)) {
            // The user has resized the properties panel. You can save this value e.g. in local
            // storage to restore it on next load and pass it as initializing option.
            console.log(`Properties panel has been resized to ${event.data.width}`);
            return;
        }

        if (isBpmnIoEvent(event)) {
            // Just a regular bpmn-js event - actually lots of them
            return;
        }

        // eslint-disable-next-line no-console
        console.log("Unhandled event received", event);
    }, [onXmlChanged]);

    /**
     * ====
     * CAUTION: Using useMemo() is important to prevent additional render cycles!
     * ====
     */

    const xmlTabOptions = useMemo(() => ({
        className: undefined,
        disabled: undefined,
        monacoOptions: undefined
    }), []);

    const propertiesPanelOptions = useMemo(() => ({
        className: undefined,
        containerId: undefined,
        container: undefined,
        elementTemplates: undefined,
        hidden: undefined,
        size: {
            max: undefined,
            min: undefined,
            initial: undefined
        }
    }), []);

    const modelerOptions = useMemo(() => ({
        className: undefined,
        ref: modelerRef,
        container: undefined,
        containerId: undefined,
        size: {
            max: undefined,
            min: undefined,
            initial: undefined
        }
    }), []);

    const bpmnJsOptions = useMemo(() => undefined, []);

    return (
        <div style={{
            height: "100vh"
        }}>

            <button
                onClick={onSaveClicked}
                style={{
                    position: "absolute",
                    zIndex: 100,
                    top: 25,
                    left: "calc(50% - 100px)",
                    textTransform: "none",
                    fontWeight: "bold",
                    minWidth: "200px",
                    minHeight: "40px",
                    backgroundColor: "yellow",
                    borderWidth: "1px",
                    borderRadius: "4px"
                }}>
                Save Diagram
            </button>

            <BpmnModeler
                xml={BPMN}
                onEvent={console.log}
                xmlTabOptions={xmlTabOptions}
                modelerTabOptions={{
                    className: undefined,
                    disabled: undefined,
                    bpmnJsOptions: bpmnJsOptions,
                    modelerOptions: modelerOptions,
                    propertiesPanelOptions: propertiesPanelOptions
                }}/>
        </div>
    );
}

export default App;

const BPMN = `<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1yociy1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.5.0">
  <bpmn:process id="Process_1j0yj4d" isExecutable="true">
    <bpmn:startEvent id="Event_0s1wl0m" name="New Application received">
      <bpmn:outgoing>Flow_04im23q</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:inclusiveGateway id="Gateway_1vziaux">
      <bpmn:incoming>Flow_1egaqyk</bpmn:incoming>
      <bpmn:outgoing>Flow_0dp4lcl</bpmn:outgoing>
      <bpmn:outgoing>Flow_1fm7qdt</bpmn:outgoing>
      <bpmn:outgoing>Flow_06f726y</bpmn:outgoing>
    </bpmn:inclusiveGateway>
    <bpmn:endEvent id="Event_11ixxb6">
      <bpmn:incoming>Flow_1maod91</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:inclusiveGateway id="Gateway_094gs4q">
      <bpmn:incoming>Flow_0lsuy6n</bpmn:incoming>
      <bpmn:incoming>Flow_0mbo0zv</bpmn:incoming>
      <bpmn:incoming>Flow_0e9cesx</bpmn:incoming>
      <bpmn:outgoing>Flow_0h676bo</bpmn:outgoing>
    </bpmn:inclusiveGateway>
    <bpmn:sequenceFlow id="Flow_04im23q" sourceRef="Event_0s1wl0m" targetRef="Activity_16ec3uz" />
    <bpmn:sequenceFlow id="Flow_1egaqyk" sourceRef="Activity_16ec3uz" targetRef="Gateway_1vziaux" />
    <bpmn:sequenceFlow id="Flow_0dp4lcl" name="Only CV available" sourceRef="Gateway_1vziaux" targetRef="Activity_0w528vc" />
    <bpmn:sequenceFlow id="Flow_1fm7qdt" name="Cover letter available" sourceRef="Gateway_1vziaux" targetRef="Activity_1p1bm68" />
    <bpmn:sequenceFlow id="Flow_06f726y" name="No application documents available" sourceRef="Gateway_1vziaux" targetRef="Activity_0lhmgqb" />
    <bpmn:sequenceFlow id="Flow_0lsuy6n" sourceRef="Activity_0w528vc" targetRef="Gateway_094gs4q" />
    <bpmn:sequenceFlow id="Flow_0mbo0zv" sourceRef="Activity_1p1bm68" targetRef="Gateway_094gs4q" />
    <bpmn:sequenceFlow id="Flow_0e9cesx" sourceRef="Activity_0lhmgqb" targetRef="Gateway_094gs4q" />
    <bpmn:sequenceFlow id="Flow_0h676bo" sourceRef="Gateway_094gs4q" targetRef="Activity_0hcjpf4" />
    <bpmn:sequenceFlow id="Flow_1maod91" sourceRef="Activity_0hcjpf4" targetRef="Event_11ixxb6" />
    <bpmn:userTask id="Activity_16ec3uz" name="Get available documents">
      <bpmn:incoming>Flow_04im23q</bpmn:incoming>
      <bpmn:outgoing>Flow_1egaqyk</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:userTask id="Activity_0w528vc" name="Check CV">
      <bpmn:incoming>Flow_0dp4lcl</bpmn:incoming>
      <bpmn:outgoing>Flow_0lsuy6n</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:userTask id="Activity_1p1bm68" name="Check cover letter">
      <bpmn:incoming>Flow_1fm7qdt</bpmn:incoming>
      <bpmn:outgoing>Flow_0mbo0zv</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:userTask id="Activity_0lhmgqb" name="Check LinkedIn profile">
      <bpmn:incoming>Flow_06f726y</bpmn:incoming>
      <bpmn:outgoing>Flow_0e9cesx</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:userTask id="Activity_0hcjpf4" name="Send response">
      <bpmn:incoming>Flow_0h676bo</bpmn:incoming>
      <bpmn:outgoing>Flow_1maod91</bpmn:outgoing>
    </bpmn:userTask>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1j0yj4d">
      <bpmndi:BPMNEdge id="Flow_1maod91_di" bpmnElement="Flow_1maod91">
        <di:waypoint x="910" y="250" />
        <di:waypoint x="982" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0h676bo_di" bpmnElement="Flow_0h676bo">
        <di:waypoint x="745" y="250" />
        <di:waypoint x="810" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0e9cesx_di" bpmnElement="Flow_0e9cesx">
        <di:waypoint x="640" y="380" />
        <di:waypoint x="720" y="380" />
        <di:waypoint x="720" y="275" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0mbo0zv_di" bpmnElement="Flow_0mbo0zv">
        <di:waypoint x="640" y="250" />
        <di:waypoint x="695" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0lsuy6n_di" bpmnElement="Flow_0lsuy6n">
        <di:waypoint x="640" y="120" />
        <di:waypoint x="720" y="120" />
        <di:waypoint x="720" y="225" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_06f726y_di" bpmnElement="Flow_06f726y">
        <di:waypoint x="450" y="275" />
        <di:waypoint x="450" y="380" />
        <di:waypoint x="540" y="380" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="455" y="380" width="70" height="40" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1fm7qdt_di" bpmnElement="Flow_1fm7qdt">
        <di:waypoint x="475" y="250" />
        <di:waypoint x="540" y="250" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="471" y="236" width="58" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0dp4lcl_di" bpmnElement="Flow_0dp4lcl">
        <di:waypoint x="450" y="225" />
        <di:waypoint x="450" y="120" />
        <di:waypoint x="540" y="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="446" y="103" width="88" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1egaqyk_di" bpmnElement="Flow_1egaqyk">
        <di:waypoint x="370" y="250" />
        <di:waypoint x="425" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_04im23q_di" bpmnElement="Flow_04im23q">
        <di:waypoint x="218" y="250" />
        <di:waypoint x="270" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_0s1wl0m_di" bpmnElement="Event_0s1wl0m">
        <dc:Bounds x="182" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="161" y="275" width="79" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1vziaux_di" bpmnElement="Gateway_1vziaux">
        <dc:Bounds x="425" y="225" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_11ixxb6_di" bpmnElement="Event_11ixxb6">
        <dc:Bounds x="982" y="232" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_094gs4q_di" bpmnElement="Gateway_094gs4q">
        <dc:Bounds x="695" y="225" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1gird4t_di" bpmnElement="Activity_16ec3uz">
        <dc:Bounds x="270" y="210" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_14uoxoa_di" bpmnElement="Activity_0w528vc">
        <dc:Bounds x="540" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0l9jfzc_di" bpmnElement="Activity_1p1bm68">
        <dc:Bounds x="540" y="210" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0lptvmx_di" bpmnElement="Activity_0lhmgqb">
        <dc:Bounds x="540" y="340" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0f5ro7d_di" bpmnElement="Activity_0hcjpf4">
        <dc:Bounds x="810" y="210" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
