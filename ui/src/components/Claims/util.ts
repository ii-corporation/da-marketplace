import { Claim } from '@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable/module';
import { Observation } from '@daml.js/da-marketplace/lib/ContingentClaims/Observation/module';
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types/module';
import { Date } from '@daml/types';

const transformObservation = (obs: Observation<Date, boolean>, linkText: string): any => {
  switch (obs.tag) {
    case 'DateEqu':
      const left1 = transformObservation(obs.value._1, 'left');
      const right1 = transformObservation(obs.value._2, 'right');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '==',
        collapsedText: `${left1.text} == ${right1.text}`,
        children: [left1, right1],
      };
    case 'DateIdentity':
      return { ...obs, linkText, type: 'Observation', text: 'Today', children: null };
    case 'DateConst':
      return { ...obs, linkText, type: 'Observation', text: obs.value, children: null };
    case 'DecimalLte':
      const left2 = transformObservation(obs.value._1, 'left');
      const right2 = transformObservation(obs.value._2, 'right');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '<=',
        collapsedText: `${left2.text} <= ${right2.text}`,
        children: [left2, right2],
      };
    case 'DecimalEqu':
      const left3 = transformObservation(obs.value._1, 'left');
      const right3 = transformObservation(obs.value._2, 'right');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '==',
        collapsedText: `${left3.text} == ${right3.text}`,
        children: [left3, right3],
      };
    case 'DecimalAdd': //TODO: collapse a + (-b) into a - b
      const left4 = transformObservation(obs.value._1, 'left');
      const right4 = transformObservation(obs.value._2, 'right');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '+',
        collapsedText: `${left4.text} + ${right4.text}`,
        children: [left4, right4],
      };
    case 'DecimalNeg':
      const left5 = transformObservation(obs.value, 'left');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '-',
        collapsedText: `-${left5}`,
        children: [left5],
      };
    case 'DecimalMul':
      const left6 = transformObservation(obs.value._1, 'left');
      const right6 = transformObservation(obs.value._2, 'right');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '*',
        collapsedText: `${left6.text} * ${right6.text}`,
        children: [left6, right6],
      };
    case 'DecimalDiv':
      const left7 = transformObservation(obs.value._1, 'left');
      const right7 = transformObservation(obs.value._2, 'right');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '/',
        collapsedText: `${left7.text} / ${right7.text}`,
        children: [left7, right7],
      };
    case 'DecimalConst':
      return { ...obs, linkText, type: 'Observation', text: obs.value, children: null };
    case 'DecimalObs':
      return { ...obs, linkText, type: 'Observation', text: `Price(${obs.value})`, children: null };
    default:
      throw new Error('Unknown observation tag: ' + obs.tag);
  }
};

export const transformClaim = (claim: Claim<Date, Id>, linkText: string): any => {
  switch (claim.tag) {
    case 'When':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformObservation(claim.value.predicate, 'condition'),
          transformClaim(claim.value.claim, 'then'),
        ],
      };
    case 'Scale':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformObservation(claim.value.k, 'factor'),
          transformClaim(claim.value.claim, 'then'),
        ],
      };
    case 'Give':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [transformClaim(claim.value, 'claim')],
      };
    case 'Or':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformClaim(claim.value.lhs, 'left'),
          transformClaim(claim.value.rhs, 'right'),
        ],
      };
    case 'And':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformClaim(claim.value.lhs, 'left'),
          transformClaim(claim.value.rhs, 'right'),
        ],
      };
    case 'Cond':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformObservation(claim.value.predicate, 'if'),
          transformClaim(claim.value.success, 'then'),
          transformClaim(claim.value.failure, 'else'),
        ],
      };
    case 'Zero':
      return { ...claim, linkText, type: 'Claim', children: null };
    case 'One':
      return { ...claim, linkText, type: 'Claim', text: '1 ' + claim.value.label, children: null };
  }
};
