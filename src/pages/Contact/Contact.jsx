import React, { useState } from 'react';
import FormInput    from '../../components/FormInput/FormInput';
import FormTextarea from '../../components/FormTextarea/FormTextarea';
import FormSelect   from '../../components/FormSelect/FormSelect';
import Button       from '../../components/Button/Button';
import styles       from './Contact.module.css';

import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { getCountryOfOrigin } from '../../utils/countryOfOrigin';

const SUBJECT_OPTIONS = [
  { value: 'general',  label: 'General Inquiry' },
  { value: 'support',  label: 'Support' },
  { value: 'billing',  label: 'Billing' },
  { value: 'other',    label: 'Other' },
];



function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const showToast = useToast();

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())    newErrors.name    = 'Name is required';
    if (!form.email.trim())   newErrors.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
                              newErrors.email   = 'Enter a valid email';
    if (!form.subject)        newErrors.subject = 'Please select a subject';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    try {
      // addDoc creates a new document in the 'contacts' collection
      // serverTimestamp() tells Firestore to record the exact server time
      await addDoc(collection(db, 'contactSubmissions'), {
        name:      form.name,
        email:     form.email,
        phone:     form.phone,
        subject:   form.subject,
        message:   form.message,
        countryOfOrigin: getCountryOfOrigin(),
        createdAt: serverTimestamp(),
      });

      // Reset form on success
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      showToast('Message sent successfully!', 'success');

    } catch (error) {
      console.error('Firebase error:', error);
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>
          We'd love to hear from you. Fill out the form and we'll get back to you shortly.
        </p>
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <FormInput
            label="Name"
            id="name"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Enter your full name"
            error={errors.name}
          />
          <FormInput
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="your.email@example.com"
            required={true}
            error={errors.email}
          />
          <FormInput
            label="Phone (Optional)"
            id="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="+1 (555) 123-4567"
          />
          <FormSelect
            label="Subject"
            id="subject"
            value={form.subject}
            onChange={handleChange('subject')}
            options={SUBJECT_OPTIONS}
            required={true}
            error={errors.subject}
          />
          <FormTextarea
            label="Message"
            id="message"
            value={form.message}
            onChange={handleChange('message')}
            placeholder="Tell us what's on your mind..."
            required={true}
            maxLength={500}
            error={errors.message}
          />
          <div className={styles.buttonRow}>
            <Button label="Send Message" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;